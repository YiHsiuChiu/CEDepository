# CEDepository 
## cloud_side
### 1. 模組安裝
```
cd cloud_side
npm install
```
### 2. 設定.env檔 (cloud_side內)
將 MongoDB 的 url 及區塊鏈帳戶的私鑰分別填入```MONGODB_URL```及```BLOCKCHAIN_ACCOUNT_PrivKey```
Note : 請事先在 MongoDB 創建 CarData 的 Collection (db name: CarData, collection name: Event,Registration)
### 3. 啟動 Server 
```
npm start
```
### 4. 後端平台功能說明
#### a. 開啟瀏覽器後，輸入```localhost:3000``` 會顯示登入畫面，接著直接按 Login 進入後端平台
![](https://i.imgur.com/7XPE6YW.png)

#### b. 註冊頁面(Register)
點選New Car按鈕，並輸入Car Address來新增車輛
![](https://i.imgur.com/G9qHWuV.png)

#### c. 搜尋頁面(Search_page)
輸入Car ID來搜尋觸發事件，可點選 CriticalEvent 及 EventList 來查看事件的詳細資料
![](https://i.imgur.com/JBxLr5c.png)

![](https://i.imgur.com/UuufhuA.png)

![](https://i.imgur.com/zu2IOVX.png)

## car_side
### 1. 模組安裝
```
cd car_side
npm install
```
### 2. 設定.env檔 (car_side內)
將 MongoDB、gateway、MQTT 的 url 及 TH 晶片的 serialport 與車機辨識地址填入env檔中
Note : 請事先在 MongoDB 創建 CED 的 Collection (db name: CED, collection name: EventData)
### 3. 啟動模組
```
node EDP.js
```
