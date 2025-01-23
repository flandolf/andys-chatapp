#!/bin/zsh

# Build the project
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    # Remove old files from destination if they exist
    sudo rm -rf /var/www/chat/*
    
    # Copy new build files to destination
    sudo cp -r dist/* /var/www/chat/
    
    # Set proper permissions
    sudo chown -R www-data:www-data /var/www/chat
    sudo chmod -R 755 /var/www/chat

    sudo systemctl restart nginx
    
    echo "Build and deployment completed successfully"
else
    echo "Build failed"
    exit 1
fi
