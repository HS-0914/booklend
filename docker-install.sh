# sudo su -
sudo apt-get update -y
sudo apt-get install \
  apt-transport-https \
  ca-certificates \
  curl \
  software-properties-common -y
  # gnupg-agent \

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository --yes \
  "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) \
  stable"

sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io -y