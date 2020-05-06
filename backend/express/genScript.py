import os
import stat
import random

user_num = 16
char_len = 6
num_len = 2
mobile_len = 10
email_prefix = '@illinois.com'
url = 'ec2-3-21-76-36.us-east-2.compute.amazonaws.com:3000/login'


def get_userNameAndPassword():
    charSet = "abcdefghijklmnopqrstuvwxyz"
    numSet = "1234567890"
    username_slice, password_slice, mobile_slice = [], [], []

    for i in range(char_len):
        username_slice.append(random.choice(charSet))
    for i in range(num_len):
        username_slice.append(random.choice(numSet))

    for i in range(char_len):
        password_slice.append(random.choice(charSet))
    for i in range(num_len):
        password_slice.append(random.choice(numSet))

    for i in range(mobile_len):
        mobile_slice.append(random.choice(numSet))

    username = ''.join(username_slice)
    email = username + email_prefix
    password = ''.join(password_slice)
    mobile = ''.join(mobile_slice)
    print(email, username, password, mobile)
    return email, password, username, mobile


def generate_script():
    script = []
    for _ in range(user_num):
        email, password, username, mobile = get_userNameAndPassword()
        script.append('curl -i -X POST -H "Content-Type: application/json" -d \'{')
        script.append(f'\"email\":\"{email}\", ')
        script.append(f'\"password\":\"{password}\", ')
        script.append(f'\"username\":\"{username}\", ')
        script.append(f'\"mobile\":\"{mobile}\"')
        script.append('}\' ')
        script.append(f'{url}\n')
        script.append('sleep .2\n')
    return ''.join(script)


def add_exec_perm(filename):
    st = os.stat(filename)
    os.chmod(filename, st.st_mode | stat.S_IEXEC)


if __name__ == '__main__':
    filename = 'createUser.sh'
    createUser_script = generate_script()

    with open(filename, 'w') as f:
        f.write(createUser_script)
    add_exec_perm(filename)

