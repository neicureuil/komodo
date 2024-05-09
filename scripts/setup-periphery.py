import sys
import os
import json
import urllib.request

def load_version():
	version = ""
	for arg in sys.argv:
		if arg.count("--version") > 0:
			version = arg.split("=")[1]
	if len(version) == 0:
		version = load_latest_version()
	return version

def load_latest_version():
	return json.load(urllib.request.urlopen("https://api.github.com/repos/mbecker20/monitor/releases/latest"))["tag_name"]

def load_paths():
	# Checks if setup.py is passed --user arg
	user_install = sys.argv.count("--user") > 0
	if user_install:
		home_dir = os.environ['HOME']
		return [
			user_install,
			# binary location
			f'{home_dir}/.local/bin',
			# config location
	 		f'{home_dir}/.config/monitor',
			# service file location
	 		f'{home_dir}/.config/systemd/user',
		]
	else:
		return [
			user_install,
			# binary location
			"/usr/local/bin",
			# config location
	 		"/etc/monitor",
			# service file location
	 		"/etc/systemd/system",
		]

def copy_binary(user_install, bin_dir, version):
	# stop periphery in case its currently in use
	user = ""
	if user_install:
		user = " --user"
	os.popen(f'systemctl{user} stop periphery')

	# ensure bin_dir exists
	if not os.path.isdir(bin_dir):
		os.makedirs(bin_dir)

	bin_path = f'{bin_dir}/periphery'
	if os.path.isfile(bin_path):
		os.remove(bin_path)

	print(os.popen(f'curl -sSL https://github.com/mbecker20/monitor/releases/download/{version}/periphery > {bin_path}').read())
	os.popen(f'chmod +x {bin_path}')

def copy_config(config_dir):
	config_file = f'{config_dir}/periphery.config.toml'

	# early return if config file already exists
	if os.path.isfile(config_file):
		print("config already exists, skipping...")
		return
	
	print(f'creating config at {config_file}')

	# ensure config dir exists
	if not os.path.isdir(config_dir):
		os.makedirs(config_dir)

	print(os.popen(f'curl -sSL https://raw.githubusercontent.com/mbecker20/monitor/main/config_example/periphery.config.example.toml > {config_dir}/periphery.config.toml').read())

def copy_service_file(bin_dir, config_dir, service_dir):
	service_file = f'{service_dir}/periphery.service'

	# early return is service file already exists
	if os.path.isfile(service_file):
		print("service file already exists, skipping...")
		return
	
	print(f'creating service file at {service_file}')
	
	# ensure service_dir exists
	if not os.path.isdir(service_dir):
		os.makedirs(service_dir)

	f = open(service_file, "x")
	f.write((
		"[Unit]\n"
		"Description=agent to connect with monitor core\n"
		"\n"
		"[Service]\n"
		f'ExecStart={bin_dir}/periphery --config-path {config_dir}/periphery.config.toml\n'
		"Restart=on-failure\n"
		"TimeoutStartSec=0\n"
		"\n"
		"[Install]\n"
		"WantedBy=default.target"
	))
	
def main():
	print("=====================")
	print(" PERIPHERY INSTALLER ")
	print("=====================")

	version = load_version()
	[user_install, bin_dir, config_dir, service_dir] = load_paths()
 
	print(f'version: {version}')
	print(f'user install: {user_install}')
	print(f'bin dir: {bin_dir}')
	print(f'config dir: {config_dir}')
	print(f'service file dir: {service_dir}')

	copy_binary(user_install, bin_dir, version)
	copy_config(config_dir)
	copy_service_file(bin_dir, config_dir, service_dir)

	user = ""
	if user_install:
		user = " --user"

	print("starting periphery...")
	print(os.popen(f'systemctl{user} start periphery').read())

	print("Finished periphery setup.\n")
	print(f'Note. Use "systemctl{user} status periphery" to make sure periphery is running')
	print(f'Note. Use "systemctl{user} enable periphery" to have periphery start on system boot')

main()