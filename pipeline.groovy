pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        DOCKER_HUB_USER = 'wathsan'
    }

    stages {
        stage('SCM Checkout') {
            steps {
                echo "DEBUG: CHECKING OUT SOURCE CODE - VERSION 2.0 (FIXED IP CAPTURE)"
                retry(3) {
                    git branch: 'main', url: 'https://github.com/wathsan11/Dev-Ops-Project-Sem-5.git'
                }
            }
        }

        stage('Infrastructure - Terraform') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-creds',
                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                    dir('terraform') {
                        sh 'ls -la' // Debug: see if main.tf exists
                        sh 'terraform init'
                        sh 'terraform apply -auto-approve'
                        script {
                            def ip = sh(script: "terraform output -raw instance_public_ip", returnStdout: true).trim()
                            echo "DEBUG: Raw IP from Terraform: '${ip}'"
                            if (ip && ip != "null" && ip != "") {
                                env.INSTANCE_IP = ip
                                echo "Successfully captured EC2 Public IP: ${env.INSTANCE_IP}"
                            } else {
                                error "Failed to capture EC2 Public IP. Terraform output was: '${ip}'"
                            }
                        }
                    }
                }
            }
        }

        stage('Configuration - Ansible') {
            steps {
                dir('ansible') {
                    withCredentials([sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY')]) {
                        sh """
                            echo "[app_servers]\n${env.INSTANCE_IP} ansible_user=ubuntu ansible_ssh_private_key_file=${SSH_KEY}" > inventory.ini
                            ansible-playbook -i inventory.ini playbook.yml --ssh-common-args='-o StrictHostKeyChecking=no'
                        """
                    }
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh '''
                         docker run --rm \
                            -v "$PWD":/app \
                            -w /app \
                            maven:3.9.6-eclipse-temurin-21 \
                            mvn clean package -DskipTests
                       '''
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([string(credentialsId: 'docker-hub-creds', variable: 'DockerPass')]) {
                    sh 'echo $DockerPass | docker login -u $DOCKER_HUB_USER --password-stdin'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                    docker build -t $DOCKER_HUB_USER/diary-backend:latest ./backend
                    docker build -t $DOCKER_HUB_USER/diary-frontend:latest ./frontend
                '''
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                sh '''
                    docker push $DOCKER_HUB_USER/diary-backend:latest
                    docker push $DOCKER_HUB_USER/diary-frontend:latest
                '''
            }
        }

        stage('Deploy to EC2') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY')]) {
                    // Transfer compose.yml and start containers on remote host
                    sh """
                        scp -i ${SSH_KEY} -o StrictHostKeyChecking=no compose.yml ubuntu@${env.INSTANCE_IP}:/home/ubuntu/
                        ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ubuntu@${env.INSTANCE_IP} "export EC2_PUBLIC_IP=${env.INSTANCE_IP} && docker compose pull && docker compose up -d"
                    """
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout'
            sh 'docker image prune -f'
        }
    }
}
