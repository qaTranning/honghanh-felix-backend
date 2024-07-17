def repo = "https://github.com/zackvn/felixzone.git"
def name = "new-admin"
def prefix = "felixzone"
def web_working_dir = "/srv/${prefix}/${name}"
def app_repo_dir = "${name}"

pipeline {
    agent any
    parameters {
        gitParameter branchFilter: 'origin/(.*)', defaultValue: 'main', name: 'GIT_BRANCH', type: 'PT_BRANCH_TAG', useRepository: "${repo}", listSize: "10", quickFilterEnabled: true, description: ''
    }
    stages {
        stage("Build") {
            stages {
                stage("Git Clone") {
                  steps {
                    script {
                      currentBuild.displayName = "${BUILD_NUMBER}-${params.GIT_BRANCH}"
                    }
                    dir("${app_repo_dir}/src") {
                      checkout scm: [$class: 'GitSCM',
                                    extensions: [[
                                                $class: 'CloneOption',
                                                shallow: true,
                                                depth:   1,
                                                timeout: 30
                                              ]],
                                     userRemoteConfigs: [[url: "${repo}", credentialsId: 'GithubToken']],
                                     branches: [[name: "${params.GIT_BRANCH}"]]]
                    }
                  }
                }


                stage("Build & Up code") {
                    steps {
                        dir("${app_repo_dir}/src/new-admin") {
                          script {
                              sh """
                                yarn install
                                yarn generate
                                sudo rsync -av --delete --exclude=.git/ .output/public/ ${web_working_dir}/.
                              """
                          }
                        }
                    }
                }
            }
        }
    }
}

