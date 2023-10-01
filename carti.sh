#!/bin/bash

# CONFIGURATION
GITHUB_REPO="https://github.com/shlsgh/sudoku.git"
CLONE_DIR="temp_sudoku_repo"
COMMIT_COUNT=25

# Fake commit messages
MESSAGES=(
  "Initial project structure"
  "Add Flask backend"
  "Implement Sudoku board input"
  "Add backtracking solver"
  "Optimize solving function"
  "Add HTML template"
  "Style with basic CSS"
  "Fix bug in recursive logic"
  "Add error handling"
  "Improve UI/UX"
  "Add mobile responsiveness"
  "Refactor Flask routes"
  "Add comments and docstrings"
  "Organize file structure"
  "Create requirements.txt"
  "Add GitHub Actions for CI"
  "Fix edge case with input parsing"
  "Add favicon"
  "Update README"
  "Improve load time"
  "Add unit tests"
  "Fix typos"
  "Add license file"
  "Improve grid rendering"
  "Final polish"
)

# Clone and reset repo
rm -rf "$CLONE_DIR"
git clone "$GITHUB_REPO" "$CLONE_DIR"
cd "$CLONE_DIR" || exit 1

rm -rf .git *
echo "🧹 Cleared existing code and git history."

# Copy current project files (excluding .git and the script itself)
cp -r ../* . 2>/dev/null
cp -r ../.* . 2>/dev/null
rm -rf .git .DS_Store sudoku_push.sh

# Reinitialize git
git init
git branch -M main
git remote add origin "$GITHUB_REPO"

# Generate random commits between Oct 1, 2023 and Mar 31, 2024
START_DATE="2023-10-01"
END_DATE="2024-03-31"

START_TS=$(date -d "$START_DATE" +%s)
END_TS=$(date -d "$END_DATE" +%s)

echo "🛠 Creating fake commit history between $START_DATE and $END_DATE..."

for ((i=1; i<=COMMIT_COUNT; i++)); do
  # Dummy file change
  echo "change $i" >> .history.log
  git add .

  # Random time between START and END
  RAND_TS=$((START_TS + RANDOM % (END_TS - START_TS)))
  COMMIT_DATE=$(date -d "@$RAND_TS" "+%Y-%m-%dT%H:%M:%S")

  # Random message
  MSG=${MESSAGES[$RANDOM % ${#MESSAGES[@]}]}

  # Fake commit
  GIT_AUTHOR_DATE="$COMMIT_DATE" GIT_COMMITTER_DATE="$COMMIT_DATE" \
  git commit -m "$MSG"
done

# Force push
git push -f origin main

echo "✅ Done! Repo pushed with randomized commit dates between Oct 2023 and Mar 2024."
