@echo off

:token
cls & Color 0F
echo What is the token of the bot?
echo go to https://discord.com/developers/applications to find the bot token
set /p "token="

Rem check if token has been entered
IF "%token%" == "" (
	cls & Color 0C
	echo Please enter the bot token
	Timeout /T 2 /NoBreak>nul
	GOTO token
)

cls
echo What is the id of the main guild of the bot?
echo Keep empty to skip
set /p "guild="

cls
echo What is the id of the owner of the bot?
echo Keep empty to skip
set /p "owner="

cls
echo What is the id of the channel to post server stats in?
echo Keep empty to skip
set /p "stats_channel="

cls
echo What is the token of the webhook to use when posting stats?
echo Keep empty to skip
set /p "stats_token="

cls
echo What is the id of the webhook to use when posting stats?
echo Keep empty to skip
set /p "stats_id="

echo BOT_TOKEN=%token%>.env
IF NOT "%guild%" == "" echo MAIN_GUILD="%guild%">>.env
IF NOT "%owner%" == "" echo OWNER_ID="%owner%">>.env
IF NOT "%stats_channel%" == "" echo STATS_CHANNEL_ID="%stats_channel%">>.env
IF NOT "%stats_token%" == "" echo STATS_WEBHOOK_TOKEN=%stats_token%>>.env
IF NOT "%stats_id%" == "" echo STATS_WEBHOOK_ID="%stats_id%">>.env

cls
npm install && npm run build