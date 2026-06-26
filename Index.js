import discord
from discord.ext import commands
import time
import re
from collections import deque, defaultdict

# Bot Tanımlamaları
intents = discord.Intents.default()
intents.message_content = True
intents.members = True

bot = commands.Bot(command_prefix="!", intents=intents)

# Değişkenleri buraya ekliyoruz ki kod aşağıda bunları tanısın
user_msgs = defaultdict(lambda: deque(maxlen=10))
join_times = deque(maxlen=20)
settings = {"anti_link": True, "anti_spam": True, "anti_raid": True}
LINK_REGEX = r"https?://\S+"
    # ===== ROAST SYSTEM =====
def roast(member):
    return f"🤖 {member.mention} spam yaptı → kicklendi 💀"

# ===== MESSAGE CONTROL =====
@bot.event
async def on_message(message):
    if message.author.bot:
        return

    uid = message.author.id
    now = time.time()

    # LINK BLOCK
    if settings["anti_link"] and re.search(LINK_REGEX, message.content):
        try:
            await message.delete()
        except:
            pass
        return

    # SPAM CHECK
    if settings["anti_spam"]:
        user_msgs[uid].append(now)

        while user_msgs[uid] and now - user_msgs[uid][0] > 4:
            user_msgs[uid].popleft()

        if len(user_msgs[uid]) >= 5:
            try:
                await message.author.kick(reason="spam")
            except:
                pass

            user_msgs[uid].clear()
            await message.channel.send(roast(message.author))

    await bot.process_commands(message)

# ===== ANTI RAID =====
@bot.event
async def on_member_join(member):
    if not settings["anti_raid"]:
        return

    now = time.time()
    join_times.append(now)

    while join_times and now - join_times[0] > 10:
        join_times.popleft()

    if len(join_times) > 5:
        try:
            await member.ban(reason="anti raid")
        except:
            pass

# ===== BOT START =====
# ⚠️ KEKE BURAYA DİKKAT: Alttaki tırnakların içine sadece o gizli Bot Tokenini yapıştır. 
# Satırın sonunda veya başında başka hiçbir şey (import os vs.) kalmasın bra!
bot.Run("MTUyMDAyMTkxMjY5NTM0MTA1Ng.Ge7t41.IEeQzQHU-0Rv92ZinFA64wgeo82VnuBljlWdGc")
