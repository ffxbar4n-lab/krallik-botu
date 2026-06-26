import discord
from discord.ext import commands
import time
from collections import deque, defaultdict

# Bot Tanımlamaları
intents = discord.Intents.default()
intents.message_content = True
intents.members = True

# Prefix ve Botu Başlatma
bot = commands.Bot(command_prefix="!", intents=intents)

# Ayarlar ve Değişkenler
user_msgs = defaultdict(lambda: deque(maxlen=10))
join_times = deque(maxlen=20)
settings = {"anti_link": True, "anti_spam": True, "anti_raid": True}
LINK_REGEX = r"https?://\S+"

# Roast Sistemi
def roast(member):
    return f"{member.mention} spam yaptı -> kicklendi 💀"

@bot.event
async def on_ready():
    print(f'Bot {bot.user} olarak giriş yaptı!')

@bot.event
async def on_message(message):
    if message.author.bot:
        return

    uid = message.author.id
    now = time.time()

    # Link Engelleme
    if settings["anti_link"] and any(x in message.content.lower() for x in ["http", "discord.gg"]):
        await message.delete()
        return

    # Spam Kontrolü
    if settings["anti_spam"]:
        user_msgs[uid].append(now)
        if len(user_msgs[uid]) >= 5 and (now - user_msgs[uid][0] < 5):
            await message.author.kick(reason="spam")
            user_msgs[uid].clear()
            await message.channel.send(roast(message.author))
            return

    await bot.process_commands(message)

@bot.event
async def on_member_join(member):
    if settings["anti_raid"]:
        join_times.append(time.time())
        if len(join_times) > 5 and (time.time() - join_times[0] < 10):
            await member.ban(reason="anti raid")

# BOTU BAŞLAT (Buraya tokenini yapıştır)
bot.run("MTUyMDAyMTkxMjY5NTM0MTA1Ng.Ge7t41.IEeQzQHU-0Rv92ZinFA64wgeo82VnuBljlWdGc")
