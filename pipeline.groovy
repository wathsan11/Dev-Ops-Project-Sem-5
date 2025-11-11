pipeline{
    stages{
        stage('SCM Checkout'){
            steps{
                retry(3){
                    git branch: 'main', url: 'https://github.com/wathsan11/Dev-Ops-Project-Sem-5.git'
                }
            }
        }
    }

}