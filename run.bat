color 0c
7z a -r ../myzip.zip * -x!.git
cd ..
aws lambda update-function-code --function-name CanvasGradie --zip-file fileb://myzip.zip
cd AlexaCanvasSkill
color 0a

rem aws s3 cp ../myzip.zip s3://canvasskillbucket/myzip.zip