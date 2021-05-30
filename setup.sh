RED="\033[0;31m"
NC="\033[0m"

while [ -z $token ]
do
	clear
	echo -e "${NC}What is the token of your bot?"
	echo go to https://discord.com/developers/applications to find your bot token
	read token

	# check if token has been entered
	if [ -z $token ]
	then
		clear
		echo -e "${RED}Please enter your bot token"
		sleep 2
	fi
done

clear
echo What is the id of the main guild of your bot?
echo Keep empty to skip
read guild

clear
echo What is the id of the owner of the bot?
echo Keep empty to skip
read owner

clear
echo What is the id of the channel to post server stats in?
echo Keep empty to skip
read stats_channel

clear
echo What is the token of the webhook to use when posting stats?
echo Keep empty to skip
read stats_token

clear
echo What is the id of the webhook to use when posting stats?
echo Keep empty to skip
read stats_id

echo BOT_TOKEN=$token>.env
if [ ! -z $guild ]
then
	echo MAIN_GUILD=\"$guild\">>.env
fi
if [ ! -z $owner ]
then
	echo OWNER_ID=\"$owner\">>.env
fi
if [ ! -z $stats_channel ]
then
	echo STATS_CHANNEL_ID=\"$stats_channel\">>.env
fi
if [ ! -z $stats_token ]
then
	echo STATS_WEBHOOK_TOKEN=$stats_token>>.env
fi
if [ ! -z $stats_id ]
then
	echo STATS_WEBHOOK_ID=\"$stats_id\">>.env
fi

clear
npm install && npm run build