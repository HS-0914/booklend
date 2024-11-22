# sudo su -
sudo apt-get update -y
sudo apt-get upgrade -y

sudo timedatectl set-timezone Asia/Seoul
# date

# free -h
sudo dd if=/dev/zero of=/swapfile bs=128M count=16
# dd: data duplicator의 약자로, 파일이나 파일 시스템의 변환 및 복사에 사용된다.
# if=/dev/zero: 입력 파일로 /dev/zero를 사용한다. /dev/zero는 무한히 0으로 채워진 데이터 스트림을 제공하는 특수 디바이스 파일이다.
# of=/swapfile: 출력 파일로 /swapfile을 사용한다. 이는 생성될 swap 파일의 경로와 이름이다.
# bs=128M: 블록 사이즈를 128MB로 설정한다. dd 명령어가 한 번에 읽고 쓰는 데이터 양을 의미한다.
# count=16: bs 명령어에서 지정한 블록 사이즈의 데이터를 16번 쓰라는 의미이다. 128x16=2048 이므로 2GB의 Swap 파일이 생성된다.
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
#  sudo swapon -s
# sudo vi /etc/fstab
# 아랫줄에 추가 /swapfile swap swap defaults 0 0