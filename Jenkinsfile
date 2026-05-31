pipeline {
    agent any

    tools {
        maven 'Maven_3.9.6'
        jdk 'Java_17'
        nodejs 'NodeJS_20'
    }

    environment {
        // Registry Credentials and Image Names
        DOCKER_REGISTRY = "docker.io"
        DOCKER_ORG      = "enterprise"
        BACKEND_IMAGE   = "${DOCKER_REGISTRY}/${DOCKER_ORG}/erm-backend"
        FRONTEND_IMAGE  = "${DOCKER_REGISTRY}/${DOCKER_ORG}/erm-frontend"
        IMAGE_TAG       = "${BUILD_NUMBER}"
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        ansiColor('xterm')
    }

    stages {
        // =====================================================================
        // STAGE 1: BACKEND VERIFICATION & COMPILATION
        // =====================================================================
        stage('Backend: Test') {
            steps {
                echo '=== Running Backend Mockito & JUnit Unit Tests ==='
                sh 'mvn -f backend/pom.xml clean test'
            }
            post {
                always {
                    junit 'backend/**/target/surefire-reports/*.xml'
                }
            }
        }

        stage('Backend: Package') {
            steps {
                echo '=== Packaging Executable Spring Boot JAR ==='
                sh 'mvn -f backend/pom.xml package -DskipTests'
            }
        }

        // =====================================================================
        // STAGE 2: FRONTEND VERIFICATION & COMPILATION
        // =====================================================================
        stage('Frontend: Build') {
            steps {
                echo '=== Installing Frontend Node Packages ==='
                dir('frontend') {
                    sh 'npm install'
                    echo '=== Building Next.js Standalone Bundle ==='
                    sh 'npm run build'
                }
            }
        }

        // =====================================================================
        // STAGE 3: CONTAINERIZATION STAGES
        // =====================================================================
        stage('Docker: Build Images') {
            steps {
                script {
                    echo '=== Building Multi-stage Backend Container ==='
                    sh "docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} -t ${BACKEND_IMAGE}:latest ./backend"

                    echo '=== Building Multi-stage Frontend Container ==='
                    sh "docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} -t ${FRONTEND_IMAGE}:latest ./frontend"
                }
            }
        }

        stage('Docker: Push Registry') {
            // Only push on master/main branch completions
            when {
                branch 'main'
            }
            steps {
                script {
                    // Requires Docker Hub or registry credentials configured with ID 'docker-hub-credentials'
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh "echo \$DOCKER_PASSWORD | docker login ${DOCKER_REGISTRY} -u \$DOCKER_USER --password-stdin"
                        
                        echo '=== Pushing Backend Images ==='
                        sh "docker push ${BACKEND_IMAGE}:${IMAGE_TAG}"
                        sh "docker push ${BACKEND_IMAGE}:latest"

                        echo '=== Pushing Frontend Images ==='
                        sh "docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}"
                        sh "docker push ${FRONTEND_IMAGE}:latest"
                    }
                }
            }
        }
    }

    post {
        always {
            echo '=== Cleaning Build Workspace ==='
            cleanWs()
        }
        success {
            echo '=== Pipeline Execution Completed Successfully! ==='
        }
        failure {
            echo '=== Pipeline Execution Encountered Failures! ==='
        }
    }
}
