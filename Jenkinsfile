pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        NODE_VERSION = 'node-v16'  // Specify the correct Node.js version
    }

    stages {
        // Step 1: Clone the repository
        stage('Clone Repository') {
            steps {
                git url: 'https://github.com/vijaylingesh744/backend.git', branch: 'main'
            }
        }

        // Step 2: Set up the frontend
        stage('Setup Frontend') {
            steps {
                script {            
                    // Change directory to frontend
                    dir('connect-souq-client') {
                        // Install Firebase and force install dependencies
                        sh 'npm install firebase@latest --force'

                        // Build the frontend application (React)
                        sh 'CI=false npm run build --force'

                       /* def user = "root" // Change this to your target user
                        def commands = 'sudo su '
                        echo "Changing to user ${root}... */

                        // Create directory for deployment in /var/www
                        sh 'mkdir -p /var/www/connect'
                        //sh 'chown -R root:root /var/www/connect'
                        //sh 'chmod -R 775 /var/www/connect'

                        // Copy the build output to the /var/www/connect directory
                        sh 'cp -R build/ /var/www/connect'
                    }
                }
            }
        }

        // Step 3: Set up the backend
        stage('Setup Backend') {
            steps {
                script {
                    // Change directory to the backend directory
                    dir('connect-souq-api/backend') {
                        // Install backend dependencies with --force
                        sh 'npm install --force'

                    // Create a directory for global packages
                    sh 'mkdir -p $HOME/.npm-global'
                    // Set npm prefix to the new directory
                    sh 'npm config set prefix "$HOME/.npm-global"'
                    // Add npm-global/bin to PATH
                    sh 'echo \'export PATH="$HOME/.npm-global/bin:$PATH"\' >> $HOME/.bashrc'
                    sh 'bash -c "source /var/lib/jenkins/.bashrc && npm install -g pm2"'
 


                        // Install PM2 globally to manage the backend process
                       // sh 'npm install -g pm2 --force'

                        // Start the backend application using PM2
                        sh 'pm2 start Server.js --name backend-app'
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed. Check the logs for errors.'
        }
    }
}
