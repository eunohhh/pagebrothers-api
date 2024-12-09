#!/bin/bash
cat <<EOF | sudo tee /etc/nginx/conf.d/https_custom.conf
server {
    listen 443 ssl;
    server_name api.pagebrothers.work;

    ssl_certificate /etc/letsencrypt/live/api.pagebrothers.work/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.pagebrothers.work/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

sudo service nginx restart
