#!/usr/bin/env bash
set -e

APP_NAME="marzneshin"
NODE_NAME="marznode"
CONFIG_DIR="/etc/opt/$APP_NAME"
DATA_DIR="/var/lib/$APP_NAME"
NODE_DATA_DIR="/var/lib/$NODE_NAME"
COMPOSE_FILE="$CONFIG_DIR/docker-compose.yml"

FETCH_REPO="marzneshin/marzneshin"
SCRIPT_URL="https://github.com/$FETCH_REPO/raw/master/script.sh"

colorized_echo() {
    local color=$1
    local text=$2

    case $color in
        "red")
        printf "\e[91m${text}\e[0m\n";;
        "green")
        printf "\e[92m${text}\e[0m\n";;
        "yellow")
        printf "\e[93m${text}\e[0m\n";;
        "blue")
        printf "\e[94m${text}\e[0m\n";;
        "magenta")
        printf "\e[95m${text}\e[0m\n";;
        "cyan")
        printf "\e[96m${text}\e[0m\n";;
        *)
            echo "${text}"
        ;;
    esac
}

check_running_as_root() {
    if [ "$(id -u)" != "0" ]; then
        colorized_echo red "This command must be run as root."
        exit 1
    fi
}

detect_os() {
    # Detect the operating system
    if [ -f /etc/lsb-release ]; then
        OS=$(lsb_release -si)
        elif [ -f /etc/os-release ]; then
        OS=$(awk -F= '/^NAME/{print $2}' /etc/os-release | tr -d '"')
        elif [ -f /etc/redhat-release ]; then
        OS=$(cat /etc/redhat-release | awk '{print $1}')
        elif [ -f /etc/arch-release ]; then
        OS="Arch"
    else
        colorized_echo red "Unsupported operating system"
        exit 1
    fi
}

detect_and_update_package_manager() {
    colorized_echo blue "Updating package manager"
    if [[ "$OS" == "Ubuntu"* ]] || [[ "$OS" == "Debian"* ]]; then
        PKG_MANAGER="apt-get"
        $PKG_MANAGER update
        elif [[ "$OS" == "CentOS"* ]] || [[ "$OS" == "AlmaLinux"* ]]; then
        PKG_MANAGER="yum"
        $PKG_MANAGER update -y
        $PKG_MANAGER install -y epel-release
        elif [ "$OS" == "Fedora"* ]; then
        PKG_MANAGER="dnf"
        $PKG_MANAGER update
        elif [ "$OS" == "Arch" ]; then
        PKG_MANAGER="pacman"
        $PKG_MANAGER -Sy
    else
        colorized_echo red "Unsupported operating system"
        exit 1
    fi
}

detect_compose() {
    # Check if docker compose command exists
    if docker compose >/dev/null 2>&1; then
        COMPOSE='docker compose'
        elif docker-compose >/dev/null 2>&1; then
        COMPOSE='docker-compose'
    else
        colorized_echo red "docker compose not found"
        exit 1
    fi
}

install_package () {
    if [ -z $PKG_MANAGER ]; then
        detect_and_update_package_manager
    fi

    PACKAGE=$1
    colorized_echo blue "Installing $PACKAGE"
    if [[ "$OS" == "Ubuntu"* ]] || [[ "$OS" == "Debian"* ]]; then
        $PKG_MANAGER -y install "$PACKAGE"
        elif [[ "$OS" == "CentOS"* ]] || [[ "$OS" == "AlmaLinux"* ]]; then
        $PKG_MANAGER install -y "$PACKAGE"
        elif [ "$OS" == "Fedora"* ]; then
        $PKG_MANAGER install -y "$PACKAGE"
        elif [ "$OS" == "Arch" ]; then
        $PKG_MANAGER -S --noconfirm "$PACKAGE"
    else
        colorized_echo red "Unsupported operating system"
        exit 1
    fi
}

install_docker() {
    # Install Docker and Docker Compose using the official installation script
    colorized_echo blue "Installing Docker"
    curl -fsSL https://get.docker.com | sh
    colorized_echo green "Docker installed successfully"
}

install_marzneshin_script() {
    colorized_echo blue "Installing marzneshin script"
    curl -sSL $SCRIPT_URL | install -m 755 /dev/stdin /usr/local/bin/marzneshin
    colorized_echo green "marzneshin script installed successfully"
}

install_marzneshin() {
    # Fetch releases
    FILES_URL_PREFIX="https://raw.githubusercontent.com/marzneshin/marzneshin/master"
	COMPOSE_FILES_URL="https://raw.githubusercontent.com/marzneshin/marzneshin-deploy/master"
 	database=$1
  	nightly=$2
  
    mkdir -p "$DATA_DIR"
    mkdir -p "$CONFIG_DIR"

    colorized_echo blue "Fetching compose file"
    curl -sL "$COMPOSE_FILES_URL/docker-compose-$database.yml" -o "$CONFIG_DIR/docker-compose.yml"
    colorized_echo green "File saved in $CONFIG_DIR/docker-compose.yml"
	if [ "$nightly" = true ]; then
	    colorized_echo red "setting compose tag to nightly."
	 	sed -ri "s/(dawsh\/marzneshin:)latest/\1nightly/g" $CONFIG_DIR/docker-compose.yml
	fi
 
    colorized_echo blue "Fetching example .env file"
    curl -sL "$FILES_URL_PREFIX/.env.example" -o "$CONFIG_DIR/.env"
    colorized_echo green "File saved in $CONFIG_DIR/.env"

    colorized_echo green "Marzneshin files downloaded successfully"
}

install_marznode_xray_config() {
    mkdir -p "$NODE_DATA_DIR"
    curl -sL "https://raw.githubusercontent.com/marzneshin/marznode/master/xray_config.json" -o "$NODE_DATA_DIR/xray_config.json"
    colorized_echo green "Sample xray config downloaded for marznode"
}

uninstall_marzneshin_script() {
    if [ -f "/usr/local/bin/marzneshin" ]; then
        colorized_echo yellow "Removing marzneshin script"
        rm "/usr/local/bin/marzneshin"
    fi
}

uninstall_marzneshin() {
    if [ -d "$CONFIG_DIR" ]; then
        colorized_echo yellow "Removing directory: $CONFIG_DIR"
        rm -r "$CONFIG_DIR"
    fi
}

uninstall_marzneshin_docker_images() {
    images=$(docker images | grep marzneshin | awk '{print $3}')

    if [ -n "$images" ]; then
        colorized_echo yellow "Removing Docker images of Marzneshin"
        for image in $images; do
            if docker rmi "$image" >/dev/null 2>&1; then
                colorized_echo yellow "Image $image removed"
            fi
        done
    fi
}

uninstall_marzneshin_data_files() {
    if [ -d "$DATA_DIR" ]; then
        colorized_echo yellow "Removing directory: $DATA_DIR"
        rm -r "$DATA_DIR"
    fi
}

uninstall_marznode_data_files() {
    if [ -d "$NODE_DATA_DIR" ]; then
        colorized_echo yellow "Removing directory: $NODE_DATA_DIR"
        rm -r "$NODE_DATA_DIR"
    fi
}


up_marzneshin() {
    $COMPOSE -f $COMPOSE_FILE -p "$APP_NAME" up -d --remove-orphans
}

down_marzneshin() {
    $COMPOSE -f $COMPOSE_FILE -p "$APP_NAME" down
}

show_marzneshin_logs() {
    $COMPOSE -f $COMPOSE_FILE -p "$APP_NAME" logs
}

follow_marzneshin_logs() {
    $COMPOSE -f $COMPOSE_FILE -p "$APP_NAME" logs -f
}

marzneshin_cli() {
    $COMPOSE -f $COMPOSE_FILE -p "$APP_NAME" exec -e CLI_PROG_NAME="marzneshin cli" marzneshin /app/marzneshin-cli.py "$@"
}


update_marzneshin_script() {
    colorized_echo blue "Updating marzneshin script"
    curl -sSL $SCRIPT_URL | install -m 755 /dev/stdin /usr/local/bin/marzneshin
    colorized_echo green "marzneshin script updated successfully"
}

update_marzneshin() {
    $COMPOSE -f $COMPOSE_FILE -p "$APP_NAME" pull
}

is_marzneshin_installed() {
    if [ -d $CONFIG_DIR ]; then
        return 0
    else
        return 1
    fi
}

is_marzneshin_up() {
    if [ -z "$($COMPOSE -f $COMPOSE_FILE ps -q -a)" ]; then
        return 1
    else
        return 0
    fi
}

install_command() {
    check_running_as_root
    # Check if marzneshin is already installed
    if is_marzneshin_installed; then
        colorized_echo red "Marzneshin is already installed at $CONFIG_DIR"
        read -p "Do you want to override the previous installation? (y/n) "
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            colorized_echo red "Aborted installation"
            exit 1
        fi
    fi
    detect_os
    if ! command -v jq >/dev/null 2>&1; then
        install_package jq
    fi
    if ! command -v curl >/dev/null 2>&1; then
        install_package curl
    fi
    if ! command -v docker >/dev/null 2>&1; then
        install_docker
    fi
	
    database="sqlite"
	nightly=false
 
	while [[ "$#" -gt 0 ]]; do
	    case $1 in
	        -d|--database)
		 		database="$2"
				if [[ ! $database =~ ^(sqlite|mariadb|mysql)$ ]]; then
				    echo "database could only be sqlite, mysql and mariadb."
					exit 1
				fi
	            shift
	            ;;
			-n|--nightly)
	            nightly=true
	            ;;
	        *)
	            echo "Unknown option: $1"
	            exit 1
	            ;;
	    esac
	    shift
	done

    detect_compose
    install_marzneshin_script
    install_marzneshin $database $nightly
    install_marznode_xray_config
    up_marzneshin
    follow_marzneshin_logs
}

uninstall_command() {
    check_running_as_root
    # Check if marzneshin is installed
    if ! is_marzneshin_installed; then
        colorized_echo red "Marzneshin's not installed!"
        exit 1
    fi

    read -p "Do you really want to uninstall Marzneshin? (y/n) "
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        colorized_echo red "Aborted"
        exit 1
    fi

    detect_compose
    if is_marzneshin_up; then
        down_marzneshin
    fi
    uninstall_marzneshin_script
    uninstall_marzneshin
    uninstall_marzneshin_docker_images

    read -p "Do you want to remove marzneshin & marznode data files too ($NODE_DATA_DIR, $DATA_DIR)? (y/n) "
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        colorized_echo green "Marzneshin uninstalled successfully"
    else
        uninstall_marzneshin_data_files
	uninstall_marznode_data_files
        colorized_echo green "Marzneshin uninstalled successfully"
    fi
}

up_command() {
    help() {
        colorized_echo red "Usage: $0 up [options]"
        echo ""
        echo "OPTIONS:"
        echo "  -h, --help        display this help message"
        echo "  -n, --no-logs     do not follow logs after starting"
    }

    local no_logs=false
    while [[ "$#" -gt 0 ]]; do
        case "$1" in
            -n|--no-logs)
                no_logs=true
            ;;
            -h|--help)
                help
                exit 0
            ;;
            *)
                echo "Error: Invalid option: $1" >&2
                help
                exit 0
            ;;
        esac
        shift
    done

    # Check if marzneshin is installed
    if ! is_marzneshin_installed; then
        colorized_echo red "Marzneshin is not installed!"
        exit 1
    fi

    detect_compose

    if is_marzneshin_up; then
        colorized_echo red "Marzneshin is already up"
        exit 1
    fi

    up_marzneshin
    if [ "$no_logs" = false ]; then
        follow_marzneshin_logs
    fi
}

down_command() {

    # Check if marzneshin is installed
    if ! is_marzneshin_installed; then
        colorized_echo red "Marzneshin's not installed!"
        exit 1
    fi

    detect_compose

    if ! is_marzneshin_up; then
        colorized_echo red "Marzneshin's already down"
        exit 1
    fi

    down_marzneshin
}

restart_command() {
    help() {
        colorized_echo red "Usage: $0 restart [options]"
        echo
        echo "OPTIONS:"
        echo "  -h, --help        display this help message"
        echo "  -n, --no-logs     do not follow logs after starting"
    }

    local no_logs=false
    while [[ "$#" -gt 0 ]]; do
        case "$1" in
            -n|--no-logs)
                no_logs=true
            ;;
            -h|--help)
                help
                exit 0
            ;;
            *)
                echo "Error: Invalid option: $1" >&2
                help
                exit 0
            ;;
        esac
        shift
    done

    # Check if marzneshin is installed
    if ! is_marzneshin_installed; then
        colorized_echo red "Marzneshin's not installed!"
        exit 1
    fi

    detect_compose

    down_marzneshin
    up_marzneshin
    if [ "$no_logs" = false ]; then
        follow_marzneshin_logs
    fi
}

status_command() {

    # Check if marzneshin is installed
    if ! is_marzneshin_installed; then
        echo -n "Status: "
        colorized_echo red "Not Installed"
        exit 1
    fi

    detect_compose

    if ! is_marzneshin_up; then
        echo -n "Status: "
        colorized_echo blue "Down"
        exit 1
    fi

    echo -n "Status: "
    colorized_echo green "Up"

    json=$($COMPOSE -f $COMPOSE_FILE ps -a --format=json)
    services=$(echo "$json" | jq -r 'if type == "array" then .[] else . end | .Service')
    states=$(echo "$json" | jq -r 'if type == "array" then .[] else . end | .State')
    # Print out the service names and statuses
    for i in $(seq 0 $(expr $(echo $services | wc -w) - 1)); do
        service=$(echo $services | cut -d' ' -f $(expr $i + 1))
        state=$(echo $states | cut -d' ' -f $(expr $i + 1))
        echo -n "- $service: "
        if [ "$state" == "running" ]; then
            colorized_echo green $state
        else
            colorized_echo red $state
        fi
    done
}

logs_command() {
    help() {
        colorized_echo red "Usage: marzneshin logs [options]"
        echo ""
        echo "OPTIONS:"
        echo "  -h, --help        display this help message"
        echo "  -n, --no-follow   do not show follow logs"
    }

    local no_follow=false
    while [[ "$#" -gt 0 ]]; do
        case "$1" in
            -n|--no-follow)
                no_follow=true
            ;;
            -h|--help)
                help
                exit 0
            ;;
            *)
                echo "Error: Invalid option: $1" >&2
                help
                exit 0
            ;;
        esac
        shift
    done

    # Check if marzneshin is installed
    if ! is_marzneshin_installed; then
        colorized_echo red "Marzneshin is not installed!"
        exit 1
    fi

    detect_compose

    if ! is_marzneshin_up; then
        colorized_echo red "Marzneshin is not up."
        exit 1
    fi

    if [ "$no_follow" = true ]; then
        show_marzneshin_logs
    else
        follow_marzneshin_logs
    fi
}

cli_command() {
    # Check if marzneshin is installed
    if ! is_marzneshin_installed; then
        colorized_echo red "Marzneshin is not installed!"
        exit 1
    fi

    detect_compose

    if ! is_marzneshin_up; then
        colorized_echo red "Marzneshin is not up."
        exit 1
    fi

    marzneshin_cli "$@"
}

update_command() {
    check_running_as_root
    # Check if marzneshin is installed
    if ! is_marzneshin_installed; then
        colorized_echo red "Marzneshin is not installed!"
        exit 1
    fi

    detect_compose

    update_marzneshin_script
    colorized_echo blue "Pulling latest version"
    update_marzneshin

    colorized_echo blue "Restarting Marzneshin's services"
    down_marzneshin
    up_marzneshin

    colorized_echo blue "Marzneshin updated successfully"
}


usage() {
    colorized_echo red "Usage: $0 [command]"
    echo
    echo "Commands:"
    echo "  up              Start services"
    echo "  down            Stop services"
    echo "  restart         Restart services"
    echo "  status          Show status"
    echo "  logs            Show logs"
    echo "  cli             Marzneshin command-line interface"
    echo "  install         Install Marzneshin"
    echo "  update          Update latest version"
    echo "  uninstall       Uninstall Marzneshin"
    echo "  install-script  Install Marzneshin script"
    echo
}

case "$1" in
    up)
    shift; up_command "$@";;
    down)
    shift; down_command "$@";;
    restart)
    shift; restart_command "$@";;
    status)
    shift; status_command "$@";;
    logs)
    shift; logs_command "$@";;
    cli)
    shift; cli_command "$@";;
    install)
    shift; install_command "$@";;
    update)
    shift; update_command "$@";;
    uninstall)
    shift; uninstall_command "$@";;
    install-script)
    shift; install_marzneshin_script "$@";;
    *)
    usage;;
esac
