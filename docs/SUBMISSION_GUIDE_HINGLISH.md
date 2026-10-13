# Submission Guide (Simple Hinglish)

## 0. Sabse pehle: kya test hua, kya NAHI
- Backend: validation, admin key, invalid ID, CORS, error responses ke automated checks pass hue. CRUD logic bhi test hua, lekin ek **in-memory fake model** ke saath (mere paas real MongoDB nahi tha).
- Frontend: `npm run build` (TypeScript check + build) pass hua. Chatbot ke rules Node mein test hue.
- **Abhi tak real MongoDB + browser mein end-to-end test nahi hua.** Ye tumhe apne laptop par karna hai (Step 2). Agar koi error aaye to exact error message mujhe bhejo, main fix kar dunga.
- Screenshots bhi tumhe khud lene hain (Step 3). Mere paas browser nahi tha.

## 1. Project chalana (PowerShell)
Pehle MongoDB check karo: `Get-Service MongoDB` -> Status `Running` hona chahiye.

**Terminal 1 (backend):**
```powershell
cd FullStack_Chatbot_Task_Vinit_Kumar\server
npm install
Copy-Item .env.example .env
code .env      # ADMIN_API_KEY ko apni lambi random value do
npm run dev
```
Expected: `MongoDB connected` aur `API running on http://localhost:5000`

**Terminal 2 (frontend):**
```powershell
cd FullStack_Chatbot_Task_Vinit_Kumar\client
npm install
npm run dev
```
Expected: `Local: http://localhost:5173/`

Optional sample data: `cd server; npm run seed`

## 2. Khud test karne ki checklist
1. http://localhost:5173/assistant kholo, 7 suggested buttons click karo, kuch ulta-seedha type karo (fallback aana chahiye), Clear chat dabao.
2. Chat ke andar "Submit an enquiry" se form bharo, khali form submit karke errors dekho, phir sahi data se submit karo (success message).
3. /contact page par bhi ek enquiry bhejo.
4. Compass mein `dronetv_assistant` -> `enquiries` collection mein records dekho.
5. /admin par `.env` wali ADMIN_API_KEY dalo: search, filter, View, status change, Delete (confirm ke saath) test karo.
6. Backend band karke form submit karo -> "Cannot reach the server" jaisa friendly error aana chahiye.
7. API tests: `docs/API_DOCUMENTATION.md` ke PowerShell commands chalao.

## 3. Screenshots (`docs/screenshots/`)
Windows par `Win + Shift + S`. In names se save karo: `home.png`, `services.png`, `courses.png`, `chatbot.png`, `chatbot-enquiry.png`, `enquiry-form-errors.png`, `enquiry-success.png`, `admin-dashboard.png`, `admin-details.png`, `delete-confirm.png`, `mongodb-compass.png`, `mobile-view.png` (browser DevTools -> device toolbar).

## 4. Video walkthrough (5-10 minute) - script
Screen recorder: Xbox Game Bar (`Win + G`) ya OBS.
- 0:00 Intro: naam, project, stack (React + TypeScript, Express, MongoDB).
- 0:30 Architecture bolo: **Frontend -> API -> Backend -> Database**. Folder structure VS Code mein dikhao.
- 1:30 Home, Services, Courses pages + mobile view.
- 3:00 Chatbot: suggested questions, history, fallback, Clear chat, in-chat enquiry.
- 4:30 Form validation errors (empty, bad email, bad phone) aur success.
- 5:30 Compass mein naya record dikhao.
- 6:30 API requests PowerShell mein (POST, GET, PATCH, DELETE) + 400/401/404 errors.
- 8:00 Admin dashboard: search, filter, details, status change, delete confirm.
- 9:00 Security points: `.env`, validation dono taraf, Helmet, rate limit, safe errors. Closing.

## 5. Evaluation mein samjhane ke points
- **Validation dono side**: `client/src/services/validation.ts` aur `server/utils/validation.js`. Client UX ke liye, server security ke liye (client par bharosa nahi).
- **Sanitization**: server HTML tags hata deta hai; React text ko automatically escape karta hai.
- **Centralized error handling**: `server/middleware/errorHandler.js`. Technical error sirf server log mein, user ko generic message.
- **Admin key**: `adminAuth.js` header `x-admin-key` check karta hai. Ye simple demo protection hai, full login system nahi. Interview mein ye honestly bolo.
- **Chatbot**: `client/src/services/chatbot.ts` keyword-matching rules. Koi external AI API nahi.
- **Mongoose schema**: `server/models/Enquiry.js` (enum, min/max length, timestamps, indexes).
- **Rate limiting**: `rateLimiters.js` (spam se bachne ke liye).

## 6. GitHub (repo name: `FullStack_Chatbot_Task_Vinit_Kumar`)
Pehle check: `server/.env` kabhi commit nahi hona chahiye (`.gitignore` mein hai).
```powershell
cd FullStack_Chatbot_Task_Vinit_Kumar
git init
git add .
git status          # yahan .env NAHI dikhna chahiye. Sirf .env.example dikhega.
git commit -m "Initial commit: DroneTV AI Support & Lead Assistant"
git branch -M main
```
GitHub par naya **public** repo banao (naam exactly `FullStack_Chatbot_Task_Vinit_Kumar`, README/gitignore add mat karo), phir:
```powershell
git remote add origin https://github.com/vinit-dot/FullStack_Chatbot_Task_Vinit_Kumar.git
git push -u origin main
```
Achha rahega agar chhote commits karo (jaise backend, frontend, docs alag) taaki Git usage dikhe. Screenshots add karke README update karo aur push karo.

## 7. Google Drive folder
Folder naam: `FullStack_Chatbot_Task_Vinit_Kumar`, andar:
| Folder | Kya daalna hai |
|---|---|
| `01_Source_Code` | Project ka ZIP (**`node_modules`, `dist` aur `.env` hata ke**) |
| `02_Screenshots` | Saare screenshots |
| `03_API_Documentation` | `docs/API_DOCUMENTATION.md` (+ Postman collection agar banao) |
| `04_Database` | `docs/database/DATABASE_SETUP.md` + Compass screenshot (+ optional export) |
| `05_Video_Walkthrough` | 5-10 min ki video (ya uski link) |
| `06_GitHub` | `github-link.txt` jisme repo URL ho |
| `07_Resume` | Updated resume **PDF** |

Sharing: "Anyone with the link can view" rakho aur submit karne se pehle incognito window mein link test karo.

## 8. Resume (PDF)
Word se `File -> Save As -> PDF`. File name: `Vinit_Kumar_MERN_Stack_Resume.pdf`.
Projects mein ye project add karo (sach-sach, bas wahi jo tumne kiya):
"DroneTV AI Support & Lead Assistant: MERN + TypeScript app with rule-based chatbot, validated enquiry form, REST CRUD API, MongoDB and admin dashboard." Resume mein GitHub repo ka link bhi daalo.

## 9. Deadline
Assignment mein deadline receive hone ke **3 din** hai. Submission Indeed message thread par reply karke bhejo.
