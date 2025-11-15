# Saving Goal Bot 💰 (LINE Chatbot)

A simple LINE chatbot that helps users **plan their saving goals**.

Users can type one message like:

> `เป้า 30000 มีแล้ว 0 ภายใน 8 เดือน`

and the bot will calculate **how much they need to save per month** (and per day) to reach their goal on time.

---

## ✨ Features / จุดเด่น

- 🧮 **Saving goal calculator**  
  - Input: target amount, current savings, and duration in months  
  - Output: required saving per month (and per day)

- 🗣 **Natural Thai input**  
  - Designed for Thai users with simple patterns like  
    `เป้า 30000 มีแล้ว 5000 ภายใน 6 เดือน`

- 💬 **Friendly conversation style**  
  - Greeting message & help message explain how to use the bot  
  - Replies feel like chatting with a friend, not a banking app

- ☁️ **Deployed on Railway**  
  - No need to keep your own PC online  
  - Uses LINE Messaging API + Node.js + Express

---

## 🧱 Tech Stack

- **Node.js** (CommonJS)
- **Express** – HTTP server
- **@line/bot-sdk** – LINE Messaging API SDK
- **dotenv** – Environment variables
- **Railway** – Hosting / Deployment

---

## 📐 How It Works (Logic)

1. Bot receives a text message from LINE via webhook (`POST /webhook`).
2. Text is parsed to extract:
   - `targetAmount` – เป้าหมายที่อยากเก็บ (เช่น 30000)
   - `currentAmount` – เงินที่มีอยู่แล้ว (เช่น 0 หรือ 5000)
   - `months` – จำนวนเดือนที่อยากเก็บให้ครบ (เช่น 8)
3. Bot calculates:

   ```text
   remaining = targetAmount - currentAmount
   perMonth = remaining / months
   perDay   = remaining / (months * 30)   
