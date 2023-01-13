/*
 Generated by typeshare 1.0.0
*/

export type PermissionsMap = Record<string, PermissionLevel>;

export interface Action {
	_id?: string;
	name: string;
	path: string;
	command: string;
	server_ids?: string[];
	group_ids?: string[];
	run_on_all?: boolean;
	permissions?: PermissionsMap;
	created_at?: string;
	updated_at?: string;
}

export interface Build {
	_id?: string;
	name: string;
	permissions?: PermissionsMap;
	server_id: string;
	version: Version;
	repo?: string;
	branch?: string;
	github_account?: string;
	on_clone?: Command;
	pre_build?: Command;
	docker_build_args?: DockerBuildArgs;
	docker_account?: string;
	last_built_at?: string;
	created_at?: string;
	updated_at?: string;
}

export interface BuildActionState {
	building: boolean;
	recloning: boolean;
	updating: boolean;
}

export interface Version {
	major: number;
	minor: number;
	patch: number;
}

export interface DockerBuildArgs {
	build_path: string;
	dockerfile_path?: string;
	build_args?: EnvironmentVar[];
}

export interface BuildVersionsReponse {
	version: Version;
	ts: string;
}

export interface Deployment {
	_id?: string;
	name: string;
	server_id: string;
	permissions?: PermissionsMap;
	docker_run_args: DockerRunArgs;
	build_id?: string;
	build_version?: Version;
	repo?: string;
	branch?: string;
	github_account?: string;
	on_clone?: Command;
	on_pull?: Command;
	repo_mount?: Conversion;
	created_at?: string;
	updated_at?: string;
}

export interface DeploymentWithContainerState {
	deployment: Deployment;
	state: DockerContainerState;
	container?: BasicContainerInfo;
}

export interface DeploymentActionState {
	deploying: boolean;
	stopping: boolean;
	starting: boolean;
	removing: boolean;
	pulling: boolean;
	recloning: boolean;
	updating: boolean;
}

export interface DockerRunArgs {
	image: string;
	ports?: Conversion[];
	volumes?: Conversion[];
	environment?: EnvironmentVar[];
	network?: string;
	restart?: RestartMode;
	post_image?: string;
	container_user?: string;
	extra_args?: string[];
	docker_account?: string;
}

export interface BasicContainerInfo {
	name: string;
	id: string;
	state: DockerContainerState;
	status?: string;
}

export interface Conversion {
	local: string;
	container: string;
}

export interface DockerContainerStats {
	name: string;
	cpu_perc: string;
	mem_perc: string;
	mem_usage: string;
	net_io: string;
	block_io: string;
	pids: string;
}

export interface Group {
	_id?: string;
	name: string;
	permissions?: PermissionsMap;
	builds: string[];
	deployments: string[];
	servers: string[];
	procedures: string[];
	groups: string[];
	created_at?: string;
	updated_at?: string;
}

export interface Command {
	path?: string;
	command?: string;
}

export interface EnvironmentVar {
	variable: string;
	value: string;
}

export interface UserCredentials {
	username: string;
	password: string;
}

export interface Procedure {
	_id?: string;
	name: string;
	stages?: ProcedureStage[];
	webhook_branches?: string[];
	permissions?: PermissionsMap;
	created_at?: string;
	updated_at?: string;
}

export interface ProcedureStage {
	operation: ProcedureOperation;
	target_id: string;
}

export interface Server {
	_id?: string;
	name: string;
	address: string;
	permissions?: PermissionsMap;
	enabled: boolean;
	to_notify?: string[];
	auto_prune?: boolean;
	cpu_alert?: number;
	mem_alert?: number;
	disk_alert?: number;
	stats_interval?: Timelength;
	region?: string;
	instance_id?: string;
	created_at?: string;
	updated_at?: string;
}

export interface ServerWithStatus {
	server: Server;
	status: ServerStatus;
}

export interface ServerActionState {
	pruning_networks: boolean;
	pruning_containers: boolean;
	pruning_images: boolean;
}

export interface SystemStatsQuery {
	cpus?: boolean;
	disks?: boolean;
	networks?: boolean;
	components?: boolean;
	processes?: boolean;
}

export interface SystemStats {
	system_load?: number;
	cpu_perc: number;
	cpu_freq_mhz: number;
	mem_used_gb: number;
	mem_total_gb: number;
	disk: DiskUsage;
	cpus?: SingleCpuUsage[];
	networks?: SystemNetwork[];
	components?: SystemComponent[];
	processes?: SystemProcess[];
	polling_rate: Timelength;
	refresh_ts: number;
	refresh_list_ts: number;
}

export interface SingleCpuUsage {
	name: string;
	usage: number;
}

export interface DiskUsage {
	used_gb: number;
	total_gb: number;
	read_kb: number;
	write_kb: number;
	disks?: SingleDiskUsage[];
}

export interface SingleDiskUsage {
	mount: string;
	used_gb: number;
	total_gb: number;
}

export interface SystemNetwork {
	name: string;
	recieved_kb: number;
	transmitted_kb: number;
}

export interface SystemComponent {
	label: string;
	temp: number;
	max: number;
	critical?: number;
}

export interface SystemProcess {
	pid: number;
	name: string;
	exe?: string;
	cmd: string[];
	start_time?: number;
	cpu_perc: number;
	mem_mb: number;
	disk_read_kb: number;
	disk_write_kb: number;
}

export interface SystemStatsRecord {
	_id?: string;
	server_id: string;
	ts: number;
	system_load?: number;
	cpu_perc: number;
	cpu_freq_mhz?: number;
	mem_used_gb: number;
	mem_total_gb: number;
	disk: DiskUsage;
	cpus?: SingleCpuUsage[];
	networks?: SystemNetwork[];
	components?: SystemComponent[];
	processes?: SystemProcess[];
	polling_rate: Timelength;
}

export interface HistoricalStatsQuery {
	interval?: Timelength;
	limit?: number;
	page?: number;
	networks?: boolean;
	components?: boolean;
}

export interface SystemInformation {
	name?: string;
	os?: string;
	kernel?: string;
	core_count?: number;
	host_name?: string;
	cpu_brand: string;
}

export interface Update {
	_id?: string;
	target: UpdateTarget;
	operation: Operation;
	logs: Log[];
	start_ts: string;
	end_ts?: string;
	status: UpdateStatus;
	success: boolean;
	operator: string;
	version?: Version;
}

export interface Log {
	stage: string;
	command: string;
	stdout: string;
	stderr: string;
	success: boolean;
	start_ts: string;
	end_ts: string;
}

export interface User {
	_id?: string;
	username: string;
	enabled: boolean;
	admin: boolean;
	create_server_permissions: boolean;
	avatar?: string;
	secrets?: ApiSecret[];
	password?: string;
	github_id?: string;
	google_id?: string;
	created_at?: string;
	updated_at?: string;
}

export interface ApiSecret {
	name: string;
	hash: string;
	created_at: string;
	expires?: string;
}

export enum DockerContainerState {
	Unknown = "unknown",
	NotDeployed = "not_deployed",
	Created = "created",
	Restarting = "restarting",
	Running = "running",
	Removing = "removing",
	Paused = "paused",
	Exited = "exited",
	Dead = "dead",
}

export enum RestartMode {
	NoRestart = "no",
	OnFailure = "on-failure",
	Always = "always",
	UnlessStopped = "unless-stopped",
}

export enum AccountType {
	Github = "github",
	Docker = "docker",
}

export enum Operation {
	None = "none",
	CreateServer = "create_server",
	UpdateServer = "update_server",
	DeleteServer = "delete_server",
	PruneImagesServer = "prune_images_server",
	PruneContainersServer = "prune_containers_server",
	PruneNetworksServer = "prune_networks_server",
	CreateBuild = "create_build",
	UpdateBuild = "update_build",
	DeleteBuild = "delete_build",
	BuildBuild = "build_build",
	RecloneBuild = "reclone_build",
	CreateDeployment = "create_deployment",
	UpdateDeployment = "update_deployment",
	DeleteDeployment = "delete_deployment",
	DeployContainer = "deploy_container",
	StopContainer = "stop_container",
	StartContainer = "start_container",
	RemoveContainer = "remove_container",
	PullDeployment = "pull_deployment",
	RecloneDeployment = "reclone_deployment",
	CreateProcedure = "create_procedure",
	UpdateProcedure = "update_procedure",
	DeleteProcedure = "delete_procedure",
	CreateGroup = "create_group",
	UpdateGroup = "update_group",
	DeleteGroup = "delete_group",
	ModifyUserEnabled = "modify_user_enabled",
	ModifyUserCreateServerPermissions = "modify_user_create_server_permissions",
	ModifyUserPermissions = "modify_user_permissions",
	AutoBuild = "auto_build",
	AutoPull = "auto_pull",
}

export enum PermissionLevel {
	None = "none",
	Read = "read",
	Execute = "execute",
	Update = "update",
}

export enum PermissionsTarget {
	Server = "server",
	Deployment = "deployment",
	Build = "build",
	Procedure = "procedure",
}

export enum Timelength {
	OneSecond = "1-sec",
	FiveSeconds = "5-sec",
	TenSeconds = "10-sec",
	ThirtySeconds = "30-sec",
	OneMinute = "1-min",
	TwoMinutes = "2-min",
	FiveMinutes = "5-min",
	TenMinutes = "10-min",
	FifteenMinutes = "15-min",
	ThirtyMinutes = "30-min",
	OneHour = "1-hr",
	TwoHours = "2-hr",
	SixHours = "6-hr",
	EightHours = "8-hr",
	TwelveHours = "12-hr",
	OneDay = "1-day",
	ThreeDay = "3-day",
	OneWeek = "1-wk",
	TwoWeeks = "2-wk",
	ThirtyDays = "30-day",
}

export enum ProcedureOperation {
	None = "none",
	PruneImagesServer = "prune_images_server",
	PruneContainersServer = "prune_containers_server",
	PruneNetworksServer = "prune_networks_server",
	BuildBuild = "build_build",
	RecloneBuild = "reclone_build",
	DeployContainer = "deploy_container",
	StopContainer = "stop_container",
	StartContainer = "start_container",
	RemoveContainer = "remove_container",
	PullDeployment = "pull_deployment",
	RecloneDeployment = "reclone_deployment",
	RunProcedure = "run_procedure",
}

export enum ServerStatus {
	Ok = "ok",
	NotOk = "not_ok",
	Disabled = "disabled",
}

export type UpdateTarget = 
	| { type: "System", id?: undefined }
	| { type: "Build", id: string }
	| { type: "Deployment", id: string }
	| { type: "Server", id: string }
	| { type: "Procedure", id: string }
	| { type: "Group", id: string };

export enum UpdateStatus {
	Queued = "queued",
	InProgress = "in_progress",
	Complete = "complete",
}

