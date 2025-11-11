pipeline {
    agent any

    stages {
        stage('SCM Checkout') {
            steps {
                retry(3) {
                    git branch: 'main', url: 'https://github.com/wathsan11/Dev-Ops-Project-Sem-5.git'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    // Build the Maven project and create target/backend-0.0.1-SNAPSHOT.jar
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

        stage('Build & Start Docker Compose') {
            steps {
                // Run Docker Compose after backend is built
                sh '''
                    docker compose down -v
                    docker compose up --build -d
                '''
            }
        }

        stage('Verify Containers') {
            steps {
                sh 'docker ps'
            }
        }


        stage('Login to Docker Hub') {
            steps {
                    withCredentials([string(credentialsId: 'test-password', variable: 'dev-pass')]) {
                        // some block
                        sh '''
                            echo "Logging into Docker Hub..."
                            docker login -u wathsan -p ${dev-pass}
                         '''
                    }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up: stopping containers'
            sh 'docker compose down -v'
        }
    }
}
