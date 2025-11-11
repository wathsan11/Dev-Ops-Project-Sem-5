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

        stage('Build Docker Image') {
            steps {
                script {
                    // Define image name and tag
                    def imageName = "wathsan/diaryapp:${env.BUILD_NUMBER}"

                    echo "Building Docker image: ${imageName}"

                    // Build image
                    sh "docker build -t ${imageName} ."

                    // Save it to a variable if you need it later (for push, deploy, etc.)
                    dockerImage = docker.image(imageName)
                }
            }
        }
    }

}