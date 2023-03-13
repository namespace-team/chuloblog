---
layout: post
title: How to add ssh and gpg keys in GitHub or GitLab?
date: 2023-02-28
author: poudelmadhav
tags: post
tag: devops
permalink: posts/2023-02-28-how-to-add-ssh-and-gpg-keys-in-github-or-gitlab/
fullname: madhav
---


# Configure git

Initial configuration of git if you have not set yet.


```shell

git config --global color.ui true

git config --global user.name "YOUR NAME"

git config --global user.email "YOUR@EMAIL.com"

ssh-keygen -t rsa -b 4096 -C "YOUR@EMAIL.com"

```

# Adding SSH key

Run this command in your terminal to generate new ssh key


```shell

ssh-keygen -t rsa -b 4096 -C "YOUR@EMAIL.com"

```

The next step is to take the newly generated SSH key and add it to your Github
or GitLab account. You can add SSH key in your setting of GitLab or GitHub. You
want to copy and paste the output of the following command and paste it in your
ssh key setting.


```shell

cat ~/.ssh/id_rsa.pub

```

Once you've done this, you can check and see if it worked:


```shell

# For GitHub

ssh -T git@github.com


# OR for GitLab

ssh -T git@gitlab.com

```


You will get a message like this


```

# For GitHub

Hi <your_usename>! You've successfully authenticated, but GitHub does not
provide shell access.


# OR for GitLab

Welcome to GitLab, @<your_username>!

```


# Signing commits with GPG

GitHub or GitLab can show whether a commit is verified or not when signed with a
GPG key. All you need to do is upload the public GPG key in your profile
settings.


# Generating a GPG key

If you don’t already have a GPG key, the following steps will help you get
started:

1. [Install GPG][gpg-install-link] for your operating system. If your Operating
System has `gpg2` installed, replace `gpg` with `gpg2` in the following
commands.

2. Generate the private/public key pair with the following command, which will
spawn a series of questions:


```shell

gpg --full-gen-key

```

3. The first question is which algorithm can be used. Select the kind you want
or press `Enter` to choose the default (RSA and RSA):

Please select what kind of key you want:


```shell

(1) RSA and RSA (default)

(2) DSA and Elgamal

(3) DSA (sign only)

(4) RSA (sign only)

Your selection? 1

```


4. The next question is key length. We recommend to choose the highest value
which is 4096:


```shell

RSA keys may be between 1024 and 4096 bits long.

What keysize do you want? (2048) 4096

Requested keysize is 4096 bits

```


5. Next, you need to specify the validity period of your key. This is something
subjective, and you can use the default value which is to never expire:


```shell

Please specify how long the key should be valid.
        0 = key does not expire
     <n>  = key expires in n days
     <n>w = key expires in n weeks
     <n>m = key expires in n months
     <n>y = key expires in n years
Key is valid for? (0) 0

Key does not expire at all

```

6. Confirm that the answers you gave were correct by typing `y`:


```shell

Is this correct? (y/N) y

```

7. Enter you real name, the email address to be associated with this key (should
match a verified email address you use in GitLab) and an optional comment (press
Enter to skip):


```shell

GnuPG needs to construct a user ID to identify your key.

Real name: Mr. Robot

Email address: <your_email
Comment:

You selected this USER-ID:
   "Mr. Robot <your_email>"
Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? O

```

8. Pick a strong password when asked and type it twice to confirm.

9. Use the following command to list the private GPG key you just created:


```shell

gpg --list-secret-keys --keyid-format LONG <your_email>

```

<i>Replace ```<your_email>``` with the email address you entered above.</i>

10. Copy the GPG key ID that starts with sec. In the following example, that’s
30F2B65B9246B6CA:


```shell

sec   rsa4096/30F2B65B9246B6CA 2017-08-18 [SC]
     D5E4F29F3275DC0CDA8FFC8730F2B65B9246B6CA
uid                   [ultimate] Mr. Robot <your_email>

ssb   rsa4096/B7ABC0813E4028C0 2017-08-18 [E]

```

11. Export the public key of that ID (replace your key ID from the previous
step):


```shell

gpg --armor --export 30F2B65B9246B6CA

```

12. Finally, copy the public key and add it in your profile settings


[gpg-install-link]: https://www.gnupg.org/download/index.html


# Associating your GPG key with Git

After you have created your GPG key and added it to your account, it’s time to
tell Git which key to use.


1. Use the following command to list the private GPG key you just created:


```shell

gpg --list-secret-keys --keyid-format LONG <your_email>

```

Replace ```<your_email>``` with the email address you entered above.

2. Copy the GPG key ID that starts with sec. In the following example, that’s
30F2B65B9246B6CA:


```shell

sec   rsa4096/30F2B65B9246B6CA 2017-08-18 [SC]
     D5E4F29F3275DC0CDA8FFC8730F2B65B9246B6CA
uid                   [ultimate] Mr. Robot <your_email>

ssb   rsa4096/B7ABC0813E4028C0 2017-08-18 [E]

```

3. Tell Git to use that key to sign the commits:


```shell

git config --global user.signingkey 30F2B65B9246B6CA

```

Replace 30F2B65B9246B6CA with your GPG key ID.


# Signing commits

After you have created your GPG key and added it to your account, you can start
signing your commits:

1. Commit like you used to, the only difference is the addition of the -S flag:


```shell

git commit -S -m "My commit msg"

```

2. Enter the passphrase of your GPG key when asked.

3. Push to GitLab and check that your commits are verified.


If you don’t want to type the -S flag every time you commit, you can tell Git to
sign your commits automatically:


```shell

git config --global commit.gpgsign true

```


# Verifying commits

Within a project or merge request, navigate to the Commits tab. Signed commits
will show a badge containing either “Verified” or “Unverified”, depending on the
verification status of the GPG signature.

![Signed and unsigned
commits](https://docs.gitlab.com/ee/user/project/repository/gpg_signed_commits/img/project_signed_and_unsigned_commits.png)


# Referece Links

* [GitHub
Docs](https://docs.gitlab.com/ee/user/project/repository/gpg_signed_commits/)

* [GoRails](https://gorails.com/setup/ubuntu/18.04#git)

* [Madhav Paudel's
Blog](https://blog.poudelmadhav.com.np/how-to-add-ssh-and-gpg-kyes-in-github-or-gitlab/)

