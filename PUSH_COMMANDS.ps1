# PowerShell Script to Push to GitHub and Create Sprint-1 Branch
# Run this script in PowerShell from your project root directory

Write-Host "🚀 Starting GitHub Push Process..." -ForegroundColor Green

# Step 1: Check Git Status
Write-Host "`n📋 Step 1: Checking Git Status..." -ForegroundColor Yellow
git status

# Step 2: Initialize Git (if needed)
Write-Host "`n📦 Step 2: Initializing Git (if needed)..." -ForegroundColor Yellow
if (-not (Test-Path .git)) {
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git already initialized" -ForegroundColor Green
}

# Step 3: Add Remote
Write-Host "`n🔗 Step 3: Adding Remote Repository..." -ForegroundColor Yellow
$remoteExists = git remote | Select-String -Pattern "origin"
if ($remoteExists) {
    Write-Host "⚠️  Remote 'origin' already exists. Removing..." -ForegroundColor Yellow
    git remote remove origin
}
git remote add origin https://github.com/9848588346Ra/Handicraft_onlinestore_Web.git
Write-Host "✅ Remote added" -ForegroundColor Green

# Step 4: Create .gitignore if not exists
Write-Host "`n📝 Step 4: Checking .gitignore..." -ForegroundColor Yellow
if (-not (Test-Path .gitignore)) {
    @"
node_modules/
dist/
.env
*.log
.DS_Store
.vscode/
.idea/
*.swp
*.swo
*~
backend/node_modules/
backend/dist/
backend/.env
"@ | Out-File -FilePath .gitignore -Encoding utf8
    Write-Host "✅ .gitignore created" -ForegroundColor Green
} else {
    Write-Host "✅ .gitignore already exists" -ForegroundColor Green
}

# Step 5: Add All Files
Write-Host "`n➕ Step 5: Adding Files to Git..." -ForegroundColor Yellow
git add .
Write-Host "✅ Files added" -ForegroundColor Green

# Step 6: Check if we need initial commit
Write-Host "`n💾 Step 6: Checking for commits..." -ForegroundColor Yellow
$hasCommits = git log --oneline -1 2>$null
if (-not $hasCommits) {
    Write-Host "Creating initial commit..." -ForegroundColor Yellow
    git commit -m "Initial commit: Handicraft Online Store"
    Write-Host "✅ Initial commit created" -ForegroundColor Green
} else {
    Write-Host "✅ Repository already has commits" -ForegroundColor Green
}

# Step 7: Create Sprint-1 Branch
Write-Host "`n🌿 Step 7: Creating Sprint-1 Branch..." -ForegroundColor Yellow
$currentBranch = git branch --show-current
if ($currentBranch -ne "sprint-1") {
    git checkout -b sprint-1
    Write-Host "✅ Created and switched to sprint-1 branch" -ForegroundColor Green
} else {
    Write-Host "✅ Already on sprint-1 branch" -ForegroundColor Green
}

# Step 8: Add Changes to Sprint-1
Write-Host "`n➕ Step 8: Adding Changes to Sprint-1..." -ForegroundColor Yellow
git add .
Write-Host "✅ Changes added" -ForegroundColor Green

# Step 9: Commit to Sprint-1
Write-Host "`n💾 Step 9: Committing to Sprint-1..." -ForegroundColor Yellow
$commitMessage = @"
feat: Add user authentication API with app-route-controller-service-repository architecture

- Implemented user registration with email uniqueness validation
- Implemented user login with password verification
- Added password hashing using bcryptjs
- Added JWT token generation
- Created Zod DTOs for request validation
- Added role-based user model (user/admin)
- Followed clean architecture pattern
- Connected to MongoDB Atlas
"@
git commit -m $commitMessage
Write-Host "✅ Committed to sprint-1" -ForegroundColor Green

# Step 10: Push to GitHub
Write-Host "`n🚀 Step 10: Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "This may prompt for GitHub credentials..." -ForegroundColor Cyan
git push -u origin sprint-1

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
    Write-Host "🔗 Repository: https://github.com/9848588346Ra/Handicraft_onlinestore_Web" -ForegroundColor Cyan
    Write-Host "🌿 Branch: sprint-1" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Push failed. Please check the error above." -ForegroundColor Red
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  - Authentication required (use Personal Access Token)" -ForegroundColor Yellow
    Write-Host "  - Remote repository may have existing commits" -ForegroundColor Yellow
}

