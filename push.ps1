# Check if a commit message is provided
if ($args.Count -eq 0) {
    Write-Host "Error: Commit message is required."
    Write-Host "Usage: ./git_push.ps1 'Your commit message'"
    exit 1
}

# Capture the commit message
$commitMessage = $args[0]

# Run the Git commands
git add .
git commit -m $commitMessage
git push -u origin main

# Notify the user
Write-Host "Changes have been pushed to origin/main with commit message: $commitMessage"