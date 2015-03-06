#!/bin/sh

api=soap-js-mapr
commonVersion=1.0
localPomDir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
environment=$1
username=$2
#password is optional
password=$3

$localPomDir/../apigee-common/scripts/commonDeploy.sh $api $commonVersion $localPomDir $environment $username $password
