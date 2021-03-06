# 車聯網關鍵資料存證服務系統 (CEDepository)   
本計畫主要目的在實作一個供電動車使用之關鍵行車資存證服務，此系統以區塊鏈為核心，提供安全、可信任之關鍵行車資料解決方案。本系統主要包含與車用電腦系統介接、接收、辨識並儲存行車資訊之車機，用於儲存關鍵資訊之智能合約實例(部署於區塊鏈上)與用於維護車輛資訊、檢視分析事件之後端管理平台。  

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
輸入 Car ID 來搜尋觸發事件，可點選 CriticalEvent 及 EventList 來查看事件的詳細資料  
![](https://i.imgur.com/UuufhuA.png)

![](https://i.imgur.com/zu2IOVX.png)

## car_side
### 1. 模組安裝
```
cd car_side
npm install
```
### 2. 設定.env檔 (car_side內)
將 MongoDB、gateway、MQTT 的 url 及 TH 晶片的 serialport 與車機辨識地址填入 env 檔中  
Note : 請事先在 MongoDB 創建 CED 的 Collection (db name: CED, collection name: EventData)  
Note : 新版本 MongoDB 需運行於64bits作業系統上，安裝前請確認車機作業系統規格
### 3. 啟動模組
```
node EDP.js
```
### 4. 車機端功能說明
#### a. EDP(ECU Data Processor): 透過 mqtt topic 蒐集車輛資料，將收到資料透過 dataProcessor event 傳至 CEP 進行 CE 判斷 並備份資料至 local DB(CED) 中  
#### b. CEP(Critical Event Processor): 依照 CE 條件判斷車輛是否發生異常狀態(CE)，若發生 CE 將事發經過資料傳至 CEDP 執行簽章動作  
#### c. CEDP(Critical Event Deposit Processor): 將資料透過 TH 晶片簽章，透過 http api 傳送至 blockchain gateway  


