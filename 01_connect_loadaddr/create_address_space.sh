#!/bin/sh
DEFINITION=$1
TOKEN=`oc whoami -t`

curl -X POST -T $DEFINITION -k -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" https://$(oc get route restapi -o jsonpath='{.spec.host}')/apis/enmasse.io/v1alpha1/namespaces/std-mt/addressspaces
