# Step-by-Step Guide: Push to GitHub and Create Sprint-1 Branch

## Repository URL
```
https://github.com/9848588346Ra/Handicraft_onlinestore_Web.git
```

---

## Step 1: Check Current Git Status

```bash
git status
```

This will show you if the repository is already initialized and what files need to be committed.

---

## Step 2: Initialize Git (if not already done)

If you see "not a git repository", run:

```bash
git init
```

---

## Step 3: Add Remote Repository

```bash
git remote add origin https://github.com/9848588346Ra/Handicraft_onlinestore_Web.git
```

**Note**: If you already have a remote named "origin", you can either:
- Remove it first: `git remote remove origin`
- Or use a different name: `git remote add upstream https://github.com/9848588346Ra/Handicraft_onlinestore_Web.git`

---

## Step 4: Create .gitignore File (if not exists)

Create a `.gitignore` file in the root directory to exclude unnecessary files:

```bash
# Create .gitignore file
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
"@ | Out-File -FilePath .gitignore -Encoding utf8
```

Or manually create `.gitignore` with:
```
node_modules/
dist/
.env
*.log
.DS_Store
.vscode/
.idea/
```

---

## Step 5: Add All Files to Git

```bash
git add .
```

This adds all files to the staging area.

---

## Step 6: Create Initial Commit (if needed)

```bash
git commit -m "Initial commit: Handicraft Online Store with authentication API"
```

---

## Step 7: Create and Switch to Sprint-1 Branch

```bash
git checkout -b sprint-1
```

This creates a new branch called "sprint-1" and switches to it.

---

## Step 8: Add All Changes to Sprint-1 Branch

```bash
git add .
```

---

## Step 9: Commit Changes to Sprint-1 Branch

```bash
git commit -m "feat: Add user authentication API with app-route-controller-service-repository architecture

- Implemented user registration with email uniqueness validation
- Implemented user login with password verification
- Added password hashing using bcryptjs
- Added JWT token generation
- Created Zod DTOs for request validation
- Added role-based user model (user/admin)
- Followed clean architecture pattern
- Connected to MongoDB Atlas"
```

---

## Step 10: Push Sprint-1 Branch to GitHub

```bash
git push -u origin sprint-1
```

The `-u` flag sets the upstream branch, so future pushes can just use `git push`.

---

## Complete Command Sequence (Copy-Paste)

```bash
# Step 1: Check status
git status

# Step 2: Initialize (if needed)
git init

# Step 3: Add remote
git remote add origin https://github.com/9848588346Ra/Handicraft_onlinestore_Web.git

# Step 4: Add all files
git add .

# Step 5: Create initial commit (if needed)
git commit -m "Initial commit: Handicraft Online Store"

# Step 6: Create and switch to sprint-1 branch
git checkout -b sprint-1

# Step 7: Add all changes
git add .

# Step 8: Commit to sprint-1
git commit -m "feat: Add user authentication API with clean architecture"

# Step 9: Push to GitHub
git push -u origin sprint-1
```

---

## Alternative: If Repository Already Has Content

If the remote repository already has commits, you may need to pull first:

```bash
# Fetch remote branches
git fetch origin

# Pull main/master branch
git pull origin main --allow-unrelated-histories
# OR
git pull origin master --allow-unrelated-histories

# Then create sprint-1 branch
git checkout -b sprint-1

# Add your changes
git add .

# Commit
git commit -m "feat: Add user authentication API"

# Push
git push -u origin sprint-1
```

---

## Verify Your Push

After pushing, you can verify by:

1. **Check branch locally:**
   ```bash
   git branch
   ```
   You should see `* sprint-1` indicating you're on that branch.

2. **Check remote branches:**
   ```bash
   git branch -r
   ```
   You should see `origin/sprint-1`.

3. **Visit GitHub:**
   Go to: https://github.com/9848588346Ra/Handicraft_onlinestore_Web
   - You should see the "sprint-1" branch
   - Click on it to see your code

---

## Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/9848588346Ra/Handicraft_onlinestore_Web.git
```

### Error: "Authentication failed"
You may need to:
1. Use a Personal Access Token instead of password
2. Or configure SSH keys
3. Or use GitHub Desktop

### Error: "Updates were rejected"
If the remote has commits you don't have:
```bash
git pull origin main --rebase
# OR
git pull origin master --rebase
```

### Error: "Branch 'sprint-1' already exists"
```bash
git checkout sprint-1
# Make your changes, then:
git add .
git commit -m "Your commit message"
git push origin sprint-1
```

---

## Next Steps After Pushing

1. **Create Pull Request** (if needed):
   - Go to GitHub repository
   - Click "Compare & pull request"
   - Create PR from `sprint-1` to `main`/`master`

2. **Continue Development**:
   ```bash
   # Make changes
   git add .
   git commit -m "Your commit message"
   git push origin sprint-1
   ```

3. **Switch Branches**:
   ```bash
   git checkout main    # Switch to main
   git checkout sprint-1 # Switch back to sprint-1
   ```

---

## Important Notes

⚠️ **Before pushing, make sure:**
- ✅ `.env` file is in `.gitignore` (contains sensitive data)
- ✅ `node_modules/` is in `.gitignore`
- ✅ All your code is committed
- ✅ You're on the correct branch (`sprint-1`)

✅ **Your repository structure should include:**
- Frontend code (src/, screens/, etc.)
- Backend code (backend/)
- Configuration files (package.json, tsconfig.json, etc.)
- Documentation (README.md, etc.)

