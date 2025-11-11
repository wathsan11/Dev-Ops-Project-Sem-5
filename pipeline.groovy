pipeline {
    agent { label 'linux' } // ensure a Linux agent with Docker + Git + shell

    stages {
        stage('SCM Checkout') {
            steps {
                retry(3) {
                    // checkout the main branch
                    git branch: 'main', url: 'https://github.com/wathsan11/Dev-Ops-Project-Sem-5.git'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    // use the Maven wrapper to build (non-interactive)
                    sh './mvnw -B -DskipTests clean package'
                }
            }
        }

        stage('Build & Start Docker Compose') {
            steps {
                // run docker compose from repo root (explicit file)
                sh '''
                    docker compose -f compose.yml down -v || true
                    docker compose -f compose.yml up --build -d
                '''
            }
        }

        stage('Verify Containers') {
            steps {
                sh 'docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up: stopping containers'
            sh 'docker compose -f compose.yml down -v || true'
            archiveArtifacts artifacts: 'backend/target/*.jar', fingerprint: true
        }
    }
}