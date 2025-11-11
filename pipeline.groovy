pipeline{

    agent any

    stages{
        stage('SCM Checkout'){
            steps{
                retry(3){
                    git branch: 'main', url: 'https://github.com/wathsan11/Dev-Ops-Project-Sem-5.git'
                }
            }
        }

       stage('Build & Start Docker Compose') {
            steps {
                // Make sure to run shell commands
                sh '''
                   # Stop & remove previous containers
                    docker compose down -v
                    
                    # Build images and start services in detached mode
                    docker compose up --build -d
                '''
            }
        }
        stage('Verify Containers') {
            steps {
                sh 'docker ps'
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