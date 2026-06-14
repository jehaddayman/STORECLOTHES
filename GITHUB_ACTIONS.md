# .github/workflows/deploy.yml - نشر تلقائي

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:7.0
        env:
          MONGO_INITDB_ROOT_USERNAME: admin
          MONGO_INITDB_ROOT_PASSWORD: password123
        options: >-
          --health-cmd "mongosh --eval 'db.runCommand(\"ping\").ok' --quiet"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 27017:27017

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install Backend Dependencies
      run: |
        cd backend
        npm install

    - name: Install Frontend Dependencies
      run: |
        cd frontend
        npm install

    - name: Build Frontend
      run: |
        cd frontend
        npm run build

    - name: Test Backend
      run: |
        cd backend
        npm start &
        sleep 3
        curl http://localhost:5000/api/health

    - name: Docker Build
      run: |
        docker-compose build

    - name: Docker Test
      run: |
        docker-compose up -d
        sleep 10
        curl http://localhost:3000
        docker-compose down

  deploy-to-production:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    steps:
    - uses: actions/checkout@v3

    - name: Deploy to Railway
      env:
        RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
      run: |
        npm i -g @railway/cli
        railway link ${{ secrets.RAILWAY_PROJECT_ID }}
        railway up

    - name: Deploy to Vercel Frontend
      env:
        VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
      run: |
        npm i -g vercel
        cd frontend
        vercel deploy --prod --token=$VERCEL_TOKEN

    - name: Notify Deployment
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        text: 'Deployment completed!'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
      if: always()
```

---

# .github/workflows/test.yml - اختبار تلقائي

```yaml
name: Automated Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]

    steps:
    - uses: actions/checkout@v3

    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}

    - name: Test Backend
      run: |
        cd backend
        npm install
        npm start &
        sleep 2
        curl -f http://localhost:5000/api/health

    - name: Build Frontend
      run: |
        cd frontend
        npm install
        npm run build

    - name: Docker Build Test
      run: |
        docker-compose build
```

---

# .github/workflows/lint.yml - فحص الكود

```yaml
name: Code Quality

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Check Syntax Backend
      run: |
        cd backend
        npm install
        node --check server.js

    - name: Check Syntax Frontend
      run: |
        cd frontend
        npm install
        npm run build

    - name: Security Audit
      run: |
        npm audit --audit-level=moderate || true
```

---

## 🔐 إضافة Secrets على GitHub

لتفعيل الـ Deployment التلقائي، أضف هذه Secrets:

1. اذهب إلى: Settings → Secrets and variables → Actions
2. أضف:

```
RAILWAY_TOKEN      = Your Railway API Token
RAILWAY_PROJECT_ID = Your Railway Project ID
VERCEL_TOKEN       = Your Vercel API Token
SLACK_WEBHOOK      = Your Slack Webhook URL (اختياري)
```

---

## 📝 التكوين

### Railway Setup

```bash
# تسجيل الدخول
railway login

# الحصول على Token
railway token

# الحصول على Project ID
railway list
```

### Vercel Setup

```bash
# الحصول على Token
vercel auth login
vercel token
```

---

## ✅ تفعيل الـ Actions

1. اضغط على "Actions" في GitHub
2. اختر أي workflow
3. اضغط "Enable"
4. عند كل push، الاختبار والنشر يبدأان تلقائياً

---

## 📊 مراقبة الـ Deployment

```bash
# عرض السجلات
git log --oneline

# عرض حالة الـ Actions
gh run list
```

---

## 🎯 التدفق التلقائي

```
Push to Main
    ↓
GitHub Actions Triggered
    ↓
Install Dependencies
    ↓
Run Tests
    ↓
Build Docker
    ↓
Deploy to Railway (Backend)
    ↓
Deploy to Vercel (Frontend)
    ↓
Notify via Slack (Optional)
    ↓
Done! ✅
```

---

**الآن الـ Deploy تلقائي عند كل push!** 🚀
