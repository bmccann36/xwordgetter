

xword-bucket-access-policy

{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::layers-bucket-brian",
                "arn:aws:s3:::layers-bucket-brian/*"
            ]
        }
    ]
}