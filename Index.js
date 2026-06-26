import os
# Render'ın kütüphaneyi otomatik yüklemesi için bu satır şart keke
os.system("pip install discord.py")

import discord
from discord.ext import commands
import time
import re
from collections import defaultdict, deque

# ===== INTENTS =====
intents = discord.Intents.default()
intents.message_content = True
intents.members = True

bot = commands.Bot(command_prefix="!", intents=intents)

# ===== SETTINGS =====
settings = {
    "anti_spam": True,
    "anti_link": True,
    "anti_raid": True,
    "panic": False
}

user_msgs = defaultdict(deque)
join_times = deque()

LINK_REGEX = r"(https?://|www\.|discord\.gg|t\.me|bit\.ly|http)"

# ===== ADMIN CHECK =====
def is_admin(ctx):
    return ctx.author.guild_permissions.administrator

# ===== BOT READY EVENT =====
@bot.event
async def on_ready():
    print(f"🤖 {bot.user.name} başarıyla aktif oldu ve krallığı koruyor!")

# ===== PANEL =====
@bot.command()
async def panel(ctx):
    await ctx.send("""
⚙️ SECURITY PANEL

!spam on/off
!link on/off
!raid on/off

!panik
!ac

!lock
!unlock

!giverole @user @role
!removerole @user @role

!status
""")

# ===== STATUS =====
@bot.command()
async def status(ctx):
    await ctx.send(f"""
📊 SYSTEM STATUS

Anti-Spam: {settings['anti_spam']}
Anti-Link: {settings['anti_link']}
Anti-Raid: {settings['anti_raid']}
Panic: {settings['panic']}
""")

# ===== TOGGLES =====
@bot.command()
async def spam(ctx, mode):
    if not is_admin(ctx): return
    settings["anti_spam"] = mode.lower() == "on"
    await ctx.send(f"Anti-Spam: {settings['anti_spam']}")

@bot.command()
async def link(ctx, mode):
    if not is_admin(ctx): return
    settings["anti_link"] = mode.lower() == "on"
    await ctx.send(f"Anti-Link: {settings['anti_link']}")

@bot.command()
async def raid(ctx, mode):
    if not is_admin(ctx): return
    settings["anti_raid"] = mode.lower() == "on"
    await ctx.send(f"Anti-Raid: {settings['anti_raid']}")

# ===== PANIC MODE =====
@bot.command()
async def panik(ctx):
    if not is_admin(ctx): return
    settings["panic"] = True

    for channel in ctx.guild.text_channels:
        try:
            await channel.set_permissions(ctx.guild.default_role, send_messages=False)
        except:
            pass

    await ctx.send("🚨 PANİK MOD AKTİF!")

@bot.command()
async def ac(ctx):
    if not is_admin(ctx): return
    settings["panic"] = False

    for channel in ctx.guild.text_channels:
        try:
            await channel.set_permissions(ctx.guild.default_role, send_messages=True)
        except:
            pass

    await ctx.send("🔓 Sistem normale döndü")

# ===== CHANNEL LOCK =====
@bot.command()
async def lock(ctx):
    if not is_admin(ctx): return
    await ctx.channel.set_permissions(ctx.guild.default_role, send_messages=False)
    await ctx.send("🔒 Kanal kilitlendi")

@bot.command()
async def unlock(ctx):
    if not is_admin(ctx): return
    await ctx.channel.set_permissions(ctx.guild.default_role, send_messages=True)
    await ctx.send("🔓 Kanal açıldı")

# ===== ROLE SYSTEM =====
@bot.command()
async def giverole(ctx, member: discord.Member, role: discord.Role):
    if not is_admin(ctx): return
    try:
        await member.add_roles(role)
        await ctx.send(f"🎭 {member.mention} → {role.name} verildi")
    except:
        await ctx.send("❌ Rol verilemedi (yetki/rol sırası kontrol et)")

@bot.command()
async def removerole(ctx, member: discord.Member, role: discord.Role):
    if not is_admin(ctx): return
    try:
        await member.remove_roles(role)
        await ctx.send(f"🎭 {role.name} alındı")
    except:
        await ctx.send("❌ Rol alınamadı")

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
# ⚠️ KEKE DİKKAT: Alttaki tırnak işaretlerinin içine Discord Developer Portal'dan aldığın "Bot Tokenini" yapıştır!
bot.run("BURAYA_DISCORD_DEVELOPER_PORTAL_TOKENINI_YAPISTIR") import os
# Render'ın kütüphaneyi otomatik yüklemesi için bu satır şart keke
os.system("pip install discord.py")

import discord
from discord.ext import commands
import time
import re
from collections import defaultdict, deque

# ===== INTENTS =====
intents = discord.Intents.default()
intents.message_content = True
intents.members = True

bot = commands.Bot(command_prefix="!", intents=intents)

# ===== SETTINGS =====
settings = {
    "anti_spam": True,
    "anti_link": True,
    "anti_raid": True,
    "panic": False
}

user_msgs = defaultdict(deque)
join_times = deque()

LINK_REGEX = r"(https?://|www\.|discord\.gg|t\.me|bit\.ly|http)"

# ===== ADMIN CHECK =====
def is_admin(ctx):
    return ctx.author.guild_permissions.administrator

# ===== BOT READY EVENT =====
@bot.event
async def on_ready():
    print(f"🤖 {bot.user.name} başarıyla aktif oldu ve krallığı koruyor!")

# ===== PANEL =====
@bot.command()
async def panel(ctx):
    await ctx.send("""
⚙️ SECURITY PANEL

!spam on/off
!link on/off
!raid on/off

!panik
!ac

!lock
!unlock

!giverole @user @role
!removerole @user @role

!status
""")

# ===== STATUS =====
@bot.command()
async def status(ctx):
    await ctx.send(f"""
📊 SYSTEM STATUS

Anti-Spam: {settings['anti_spam']}
Anti-Link: {settings['anti_link']}
Anti-Raid: {settings['anti_raid']}
Panic: {settings['panic']}
""")

# ===== TOGGLES =====
@bot.command()
async def spam(ctx, mode):
    if not is_admin(ctx): return
    settings["anti_spam"] = mode.lower() == "on"
    await ctx.send(f"Anti-Spam: {settings['anti_spam']}")

@bot.command()
async def link(ctx, mode):
    if not is_admin(ctx): return
    settings["anti_link"] = mode.lower() == "on"
    await ctx.send(f"Anti-Link: {settings['anti_link']}")

@bot.command()
async def raid(ctx, mode):
    if not is_admin(ctx): return
    settings["anti_raid"] = mode.lower() == "on"
    await ctx.send(f"Anti-Raid: {settings['anti_raid']}")

# ===== PANIC MODE =====
@bot.command()
async def panik(ctx):
    if not is_admin(ctx): return
    settings["panic"] = True

    for channel in ctx.guild.text_channels:
        try:
            await channel.set_permissions(ctx.guild.default_role, send_messages=False)
        except:
            pass

    await ctx.send("🚨 PANİK MOD AKTİF!")

@bot.command()
async def ac(ctx):
    if not is_admin(ctx): return
    settings["panic"] = False

    for channel in ctx.guild.text_channels:
        try:
            await channel.set_permissions(ctx.guild.default_role, send_messages=True)
        except:
            pass

    await ctx.send("🔓 Sistem normale döndü")

# ===== CHANNEL LOCK =====
@bot.command()
async def lock(ctx):
    if not is_admin(ctx): return
    await ctx.channel.set_permissions(ctx.guild.default_role, send_messages=False)
    await ctx.send("🔒 Kanal kilitlendi")

@bot.command()
async def unlock(ctx):
    if not is_admin(ctx): return
    await ctx.channel.set_permissions(ctx.guild.default_role, send_messages=True)
    await ctx.send("🔓 Kanal açıldı")

# ===== ROLE SYSTEM =====
@bot.command()
async def giverole(ctx, member: discord.Member, role: discord.Role):
    if not is_admin(ctx): return
    try:
        await member.add_roles(role)
        await ctx.send(f"🎭 {member.mention} → {role.name} verildi")
    except:
        await ctx.send("❌ Rol verilemedi (yetki/rol sırası kontrol et)")

@bot.command()
async def removerole(ctx, member: discord.Member, role: discord.Role):
    if not is_admin(ctx): return
    try:
        await member.remove_roles(role)
        await ctx.send(f"🎭 {role.name} alındı")
    except:
        await ctx.send("❌ Rol alınamadı")

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
# ⚠️ KEKE DİKKAT: Alttaki tırnak işaretlerinin içine Discord Developer Portal'dan aldığın "Bot Tokenini" yapıştır!
bot.run("https://discord.com/oauth2/authorize?client_id=1519973867823697980&permissions=8&integration_type=0&scope=bot+applications.commands")
