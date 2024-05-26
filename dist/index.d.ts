import * as React$1 from 'react';
import React__default, { ChangeEvent } from 'react';
import { ImportRemoteOptions } from '@module-federation/utilities';
import * as js_logger from 'js-logger';
import js_logger__default, { GlobalLogger, ILogLevel, ILogger } from 'js-logger';
export * from 'js-logger';
import Jolokia, { MBeanInfo, MBeanInfoError, MBeanAttribute, MBeanOperation, ListRequestOptions, Request, Response, ErrorResponse } from 'jolokia.js';
import * as _patternfly_react_icons_dist_esm_createIcon from '@patternfly/react-icons/dist/esm/createIcon';
import { TreeViewDataItem } from '@patternfly/react-core';

type HawtioProps = {
    basepath?: string;
};
declare const Hawtio: React__default.FunctionComponent<HawtioProps>;

declare const PUBLIC_USER = "public";

/**
 * Custom React hook for using Hawtio users.
 */
declare function useUser(): {
    username: string;
    isLogin: boolean;
    userLoaded: boolean;
    userLoading: boolean;
};

type User = {
    username: string;
    isLogin: boolean;
    isLoading?: boolean;
};
type ResolveUser = (user: User) => void;
type FetchUserHook = (resolve: ResolveUser, proceed?: () => boolean) => Promise<boolean>;
type LogoutHook = () => Promise<boolean>;
interface IUserService {
    addFetchUserHook(name: string, hook: FetchUserHook): void;
    addLogoutHook(name: string, hook: LogoutHook): void;
    fetchUser(retry?: boolean, proceed?: () => boolean): Promise<void>;
    getUsername(): Promise<string>;
    isLogin(): Promise<boolean>;
    getToken(): string | null;
    setToken(token: string): void;
    logout(): Promise<void>;
}
declare class UserService implements IUserService {
    private readonly user;
    private resolveUser;
    private fetchUserHooks;
    private logoutHooks;
    private token;
    constructor();
    addFetchUserHook(name: string, hook: FetchUserHook): void;
    addLogoutHook(name: string, hook: LogoutHook): void;
    /**
     * Sync login status with the server by fetching login user.
     */
    fetchUser(retry?: boolean, proceed?: () => boolean): Promise<void>;
    getUsername(): Promise<string>;
    isLogin(): Promise<boolean>;
    isLoading(): Promise<boolean>;
    getToken(): string | null;
    setToken(token: string): void;
    logout(): Promise<void>;
}
declare const userService: UserService;
declare const __testing__: {
    UserService: typeof UserService;
};

/**
 * Components to be added to the header navbar
 * Can define either a single component type or
 * a component with a universal property.
 *
 * By default, components will only be displayed
 * if the plugin UI is also visible. However, setting
 * universal to 'true' will ensure the component
 * remains displayed regardless of which plugin is
 * given focus.
 */
interface UniversalHeaderItem {
    /**
     * The component that should be populated as
     * a dropdown item on the header bar.
     */
    component: React.ComponentType<any>;
    /**
     * Should components remain visible on header even when
     * the plugin is not being displayed.
     */
    universal: boolean;
}
type HeaderItem = React.ComponentType<any> | UniversalHeaderItem;
declare function isUniversalHeaderItem(item: HeaderItem): item is UniversalHeaderItem;
/**
 * Internal representation of a Hawtio plugin.
 */
interface Plugin {
    /**
     * Mandatory, unique plugin identifier
     */
    id: string;
    /**
     * Title to be displayed in left PageSidebar
     */
    title?: string;
    /**
     * Path for plugin's main component. Optional if the plugin only contributes header elements for example
     */
    path?: string;
    /**
     * The order to be shown in the Hawtio sidebar.
     *
     * This only controls presentation and doesn't change the order of plugin to
     * be loaded.
     *
     * If it's not specified, it defaults to `100`. `0` ~ `30` are reserved for
     * the builtin plugins.
     */
    order?: number;
    /**
     * If this plugin provides a login form component
     */
    isLogin?: boolean;
    /**
     * Plugins main component to be displayed
     */
    component?: React.ComponentType<any>;
    headerItems?: HeaderItem[];
    /**
     * Returns if this plugin should be activated.
     * This method needs to return a promise as the process of resolving if a plugin
     * should be activated may require information collected asynchronously such as
     * the existence of some MBeans, etc.
     */
    isActive: () => Promise<boolean>;
}
/**
 * Type definition of the entry point for a Hawtio plugin.
 */
type HawtioPlugin = () => void;
interface HawtioRemote extends ImportRemoteOptions {
    pluginEntry?: string;
}
/**
 * Hawtio core service.
 *
 * This service provides the following functionalities:
 * - Base path provisioning
 * - Plugin loader and discovery mechanism
 */
declare class HawtioCore {
    /**
     * Hawtio base path.
     */
    private basePath?;
    /**
     * List of URLs that the plugin loader will try and discover plugins from.
     */
    private urls;
    /**
     * Holds all of the Hawtio plugins that need to be bootstrapped.
     */
    private plugins;
    /**
     * Sets the base path of the Hawtio console.
     * If the given path includes trailing '/', it will be trimmed.
     */
    setBasePath(path: string): void;
    /**
     * Returns the base path of the Hawtio console without trailing '/'.
     */
    getBasePath(): string | undefined;
    private documentBase;
    /**
     * Adds an angular module to the list of modules to bootstrap.
     */
    addPlugin(plugin: Plugin): HawtioCore;
    /**
     * Adds a URL for discovering plugins.
     */
    addUrl(url: string): HawtioCore;
    /**
     * Bootstraps Hawtio.
     */
    bootstrap(): Promise<void>;
    /**
     * Downloads plugins from any configured URLs and load them.
     * It is invoked at Hawtio's bootstrapping.
     *
     * This plugin mechanism is implemented based on Webpack Module Federation.
     * https://module-federation.github.io/
     */
    private loadPlugins;
    /**
     * Loads external plugins from the given URL. The URL endpoint is expected to
     * return an array of HawtioRemote objects.
     */
    private loadExternalPlugins;
    getPlugins(): Plugin[];
    /**
     * Resolves which of registered plugins are active with the current environment.
     *
     * There are two types of plugin: normal plugin and login plugin.
     * If it's normal, it's only resolved when the user is already logged in.
     * If it's login, it's only resolved when the user is not logged in yet, and thus
     * can only affects the login page.
     *
     * Therefore, this method depends on the login status provided by the `userService`.
     */
    resolvePlugins(): Promise<Plugin[]>;
}
/**
 * Hawtio core singleton instance.
 */
declare const hawtio: HawtioCore;

declare const DEFAULT_APP_NAME = "Hawtio Management Console";
declare const DEFAULT_LOGIN_TITLE = "Log in to your account";
/**
 * The single user-customisable entrypoint for the Hawtio console configurations.
 */
type Hawtconfig = {
    /**
     * Configuration for branding & styles.
     */
    branding?: BrandingConfig;
    /**
     * Configuration for the built-in login page.
     */
    login?: LoginConfig;
    /**
     * Configuration for the About modal.
     */
    about?: AboutConfig;
    /**
     * The user can explicitly disable plugins by specifying the plugin route paths.
     *
     * This option can be used if some of the built-in plugins are not desirable
     * for the custom installation of Hawtio console.
     */
    disabledRoutes?: DisabledRoutes;
    /**
     * Configuration for JMX plugin.
     */
    jmx?: JmxConfig;
    /**
     * Configuration for Hawtio Online.
     */
    online?: OnlineConfig;
};
/**
 * Branding configuration type.
 */
type BrandingConfig = {
    appName?: string;
    showAppName?: boolean;
    appLogoUrl?: string;
    css?: string;
    favicon?: string;
};
/**
 * Login configuration type.
 */
type LoginConfig = {
    title?: string;
    description?: string;
    links?: LoginLink[];
};
type LoginLink = {
    url: string;
    text: string;
};
/**
 * About configuration type.
 */
type AboutConfig = {
    title?: string;
    description?: string;
    imgSrc?: string;
    productInfo?: AboutProductInfo[];
    copyright?: string;
};
type AboutProductInfo = {
    name: string;
    value: string;
};
type DisabledRoutes = string[];
/**
 * JMX configuration type.
 */
type JmxConfig = {
    /**
     * This option can either disable workspace completely by setting `false`, or
     * specify an array of MBean paths in the form of
     * `<domain>/<prop1>=<value1>,<prop2>=<value2>,...`
     * to fine-tune which MBeans to load into workspace.
     *
     * Note that disabling workspace should also deactivate all the plugins that
     * depend on MBeans provided by workspace.
     *
     * @see https://github.com/hawtio/hawtio-next/issues/421
     */
    workspace?: boolean | string[];
};
/**
 * Hawtio Online configuration type.
 */
type OnlineConfig = {
    /**
     * Selector for OpenShift projects or Kubernetes namespaces.
     *
     * @see https://github.com/hawtio/hawtio-online/issues/64
     */
    projectSelector?: string;
};
declare const HAWTCONFIG_JSON = "hawtconfig.json";
declare class ConfigManager {
    private config?;
    reset(): void;
    setHawtconfig(config: Hawtconfig): void;
    getHawtconfig(): Promise<Hawtconfig>;
    private loadConfig;
    configure(configurer: (config: Hawtconfig) => void): Promise<void>;
    applyBranding(): Promise<boolean>;
    private updateHref;
    isRouteEnabled(path: string): Promise<boolean>;
    filterEnabledPlugins(plugins: Plugin[]): Promise<Plugin[]>;
    addProductInfo(name: string, value: string): Promise<void>;
}
declare const configManager: ConfigManager;

type NotificationType = 'default' | 'info' | 'success' | 'warning' | 'danger';
type Notification = {
    type: NotificationType;
    message: string;
    duration?: number;
};
type EventListener = () => void;
type NotificationListener = (notification: Notification) => void;
type HawtioEvent = 'notify' | 'login' | 'logout' | 'refresh' | 'pluginsUpdated';
declare const EVENT_NOTIFY: HawtioEvent;
declare const EVENT_LOGIN: HawtioEvent;
declare const EVENT_LOGOUT: HawtioEvent;
declare const EVENT_REFRESH: HawtioEvent;
declare const EVENT_PLUGINS_UPDATED: HawtioEvent;
interface IEventService {
    notify(notification: Notification): void;
    onNotify(listener: NotificationListener): void;
    login(): void;
    onLogin(listener: EventListener): void;
    logout(): void;
    onLogout(listener: EventListener): void;
    refresh(): void;
    onRefresh(listener: EventListener): void;
    pluginsUpdated(): void;
    onPluginsUpdated(listener: EventListener): void;
    removeListener(event: HawtioEvent, listener: EventListener | NotificationListener): void;
}
declare class EventService implements IEventService {
    private eventEmitter;
    notify(notification: Notification): void;
    onNotify(listener: NotificationListener): void;
    login(): void;
    onLogin(listener: EventListener): void;
    logout(): void;
    onLogout(listener: EventListener): void;
    refresh(): void;
    onRefresh(listener: EventListener): void;
    pluginsUpdated(): void;
    onPluginsUpdated(listener: EventListener): void;
    removeListener(event: HawtioEvent, listener: EventListener | NotificationListener): void;
}
declare const eventService: EventService;

/**
 * Custom React hook for using Hawtio plugins.
 */
declare function usePlugins(): {
    plugins: Plugin[];
    pluginsLoaded: boolean;
};
/**
 * Custom React hook for using hawtconfig.json.
 */
declare function useHawtconfig(): {
    hawtconfig: Hawtconfig;
    hawtconfigLoaded: boolean;
};

declare const STORAGE_KEY_LOG_LEVEL = "core.logging.logLevel";
declare const STORAGE_KEY_CHILD_LOGGERS = "core.logging.childLoggers";
interface HawtioLogger extends GlobalLogger {
    getChildLoggers(): ChildLogger[];
    getAvailableChildLoggers(): ChildLogger[];
    addChildLogger(logger: ChildLogger): void;
    updateChildLogger(name: string, level: ILogLevel | string): void;
    removeChildLogger(logger: ChildLogger): void;
}
interface ChildLogger {
    name: string;
    filterLevel: ILogLevel;
}
declare class LocalStorageHawtioLogger implements HawtioLogger {
    TRACE: ILogLevel;
    DEBUG: ILogLevel;
    INFO: ILogLevel;
    TIME: ILogLevel;
    WARN: ILogLevel;
    ERROR: ILogLevel;
    OFF: ILogLevel;
    trace: (...x: any[]) => void;
    debug: (...x: any[]) => void;
    info: (...x: any[]) => void;
    log: (...x: any[]) => void;
    warn: (...x: any[]) => void;
    error: (...x: any[]) => void;
    time: (label: string) => void;
    timeEnd: (label: string) => void;
    getLevel: () => ILogLevel;
    enabledFor: (level: ILogLevel) => boolean;
    useDefaults: (options?: js_logger.ILoggerOpts | undefined) => void;
    setHandler: (logHandler: js_logger.ILogHandler) => void;
    createDefaultHandler: typeof js_logger__default.createDefaultHandler;
    private readonly LOG_LEVEL_MAP;
    get(name: string): ILogger;
    setLevel(level: ILogLevel | string): void;
    private loggers;
    constructor();
    private toLogLevel;
    private loadLogLevel;
    private saveLogLevel;
    private loadChildLoggers;
    private saveChildLoggers;
    getChildLoggers(): ChildLogger[];
    getAvailableChildLoggers(): ChildLogger[];
    addChildLogger(logger: ChildLogger): void;
    updateChildLogger(name: string, level: ILogLevel | string): void;
    removeChildLogger(logger: ChildLogger): void;
}
/**
 * Hawtio logger
 */
declare const Logger: LocalStorageHawtioLogger;

type Help = {
    id: string;
    title: string;
    content: string;
    order: number;
};
declare class HelpRegistry {
    private helps;
    add(id: string, title: string, content: string, order?: number): void;
    getHelps(): Help[];
    reset(): void;
}
declare const helpRegistry: HelpRegistry;

declare const keycloak: HawtioPlugin;

declare const oidc: HawtioPlugin;

declare const camel: HawtioPlugin;

declare const HawtioEmptyCard: React__default.FunctionComponent<{
    title?: string;
    message: string;
    testid?: string;
}>;

declare const HawtioLoadingCard: React__default.FunctionComponent<{
    message?: string;
    testid?: string;
}>;

declare const JmxContentMBeans: React.FunctionComponent;

interface ToolbarProps {
    onSearch: (event: ChangeEvent<HTMLInputElement>) => void;
    onSetExpanded: (newExpanded: boolean) => void;
}
declare const PluginTreeViewToolbar: React__default.FunctionComponent<ToolbarProps>;

declare const Attributes: React__default.FunctionComponent;

declare const AttributeModal: React__default.FunctionComponent<{
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
    input: {
        name: string;
        value: string;
    };
}>;

declare const AttributeTable: React__default.FunctionComponent;

declare const Chart: React__default.FunctionComponent;

type Connections = {
    [key: string]: Connection;
};
type Connection = {
    id: string;
    name: string;
    scheme: 'http' | 'https';
    host: string;
    port: number;
    path: string;
    jolokiaUrl?: string;
    username?: string;
    password?: string;
    token?: string;
};
declare const INITIAL_CONNECTION: Connection;
type ConnectionTestResult = {
    status: ConnectStatus;
    message: string;
};
type ConnectionCredentials = {
    username: string;
    password: string;
};
type LoginResult = {
    type: 'success';
} | {
    type: 'failure';
} | {
    type: 'throttled';
    retryAfter: number;
} | {
    type: 'session-expired';
};
/**
 * Remote connection status. "not-reachable-securely" is for connections that can't be used in insecure contexts.
 */
type ConnectStatus = 'not-reachable' | 'reachable' | 'not-reachable-securely';
declare const SESSION_KEY_CURRENT_CONNECTION = "connect.currentConnection";
declare const PARAM_KEY_CONNECTION = "con";
declare const PARAM_KEY_REDIRECT = "redirect";
interface IConnectService {
    getCurrentConnectionName(): string | null;
    getCurrentConnection(): Promise<Connection | null>;
    getCurrentCredentials(): Promise<ConnectionCredentials | null>;
    loadConnections(): Connections;
    saveConnections(connections: Connections): void;
    getConnection(name: string): Connection | null;
    connectionToUrl(connection: Connection): string;
    checkReachable(connection: Connection): Promise<ConnectStatus>;
    testConnection(connection: Connection): Promise<ConnectionTestResult>;
    connect(connection: Connection): void;
    login(username: string, password: string): Promise<LoginResult>;
    redirect(): void;
    createJolokia(connection: Connection, checkCredentials?: boolean): Jolokia;
    getJolokiaUrl(connection: Connection): string;
    getJolokiaUrlFromName(name: string): string | null;
    getLoginPath(): string;
    export(connections: Connections): void;
}
declare class ConnectService implements IConnectService {
    private readonly currentConnection;
    constructor();
    private initCurrentConnection;
    getCurrentConnectionId(): string | null;
    getCurrentConnectionName(): string | null;
    getCurrentConnection(): Promise<Connection | null>;
    private clearCredentialsOnLogout;
    getCurrentCredentials(): Promise<ConnectionCredentials | null>;
    private setCurrentCredentials;
    loadConnections(): Connections;
    saveConnections(connections: Connections): void;
    generateId(connection: Connection, connections: Connections): void;
    getConnection(name: string): Connection | null;
    connectionToUrl(connection: Connection): string;
    checkReachable(connection: Connection): Promise<ConnectStatus>;
    testConnection(connection: Connection): Promise<ConnectionTestResult>;
    private forbiddenReasonMatches;
    connect(connection: Connection): void;
    /**
     * Log in to the current connection.
     */
    login(username: string, password: string): Promise<LoginResult>;
    /**
     * Redirect to the URL specified in the query parameter {@link PARAM_KEY_REDIRECT}.
     */
    redirect(): void;
    /**
     * Create a Jolokia instance with the given connection.
     */
    createJolokia(connection: Connection, checkCredentials?: boolean): Jolokia;
    /**
     * Get the Jolokia URL for the given connection.
     */
    getJolokiaUrl(connection: Connection): string;
    /**
     * Get the Jolokia URL for the given connection name.
     */
    getJolokiaUrlFromName(name: string): string | null;
    getLoginPath(): string;
    export(connections: Connections): void;
}
declare const connectService: ConnectService;

declare const Icons: {
    readonly folder: React__default.CElement<_patternfly_react_icons_dist_esm_createIcon.SVGIconProps, React__default.Component<_patternfly_react_icons_dist_esm_createIcon.SVGIconProps, any, any>>;
    readonly folderOpen: React__default.CElement<_patternfly_react_icons_dist_esm_createIcon.SVGIconProps, React__default.Component<_patternfly_react_icons_dist_esm_createIcon.SVGIconProps, any, any>>;
    readonly mbean: React__default.CElement<_patternfly_react_icons_dist_esm_createIcon.SVGIconProps, React__default.Component<_patternfly_react_icons_dist_esm_createIcon.SVGIconProps, any, any>>;
    readonly locked: React__default.CElement<_patternfly_react_icons_dist_esm_createIcon.SVGIconProps, React__default.Component<_patternfly_react_icons_dist_esm_createIcon.SVGIconProps, any, any>>;
};
type OptimisedJmxDomains = Record<string, OptimisedJmxDomain>;
declare function isJmxDomains(value: unknown): value is OptimisedJmxDomains;
type OptimisedJmxDomain = Record<string, OptimisedMBeanInfo>;
declare function isJmxDomain(value: unknown): value is OptimisedJmxDomain;
interface OptimisedMBeanInfo extends Omit<MBeanInfo, 'attr' | 'op'> {
    attr?: Record<string, OptimisedMBeanAttribute>;
    op?: OptimisedMBeanOperations;
    opByString?: Record<string, OptimisedMBeanOperation>;
    canInvoke?: boolean;
}
declare function isMBeanInfo(value: unknown): value is OptimisedMBeanInfo;
declare function isMBeanInfoError(value: unknown): value is MBeanInfoError;
interface OptimisedMBeanAttribute extends MBeanAttribute {
    canInvoke?: boolean;
}
type OptimisedMBeanOperations = Record<string, OptimisedMBeanOperation | OptimisedMBeanOperation[]>;
interface OptimisedMBeanOperation extends MBeanOperation {
    canInvoke?: boolean;
}
type MBeanNodeFilterFn = (node: MBeanNode) => boolean;
declare const MBEAN_NODE_ID_SEPARATOR = "-";
declare class MBeanNode implements TreeViewDataItem {
    parent: MBeanNode | null;
    readonly name: string;
    private readonly folder;
    /**
     * ID of the tree view item in HTML.
     */
    id: string;
    icon: React__default.ReactNode;
    expandedIcon?: React__default.ReactNode;
    children?: MBeanNode[];
    /**
     * Various metadata that can be attached to the node for processing it in the MBean tree.
     */
    private metadata;
    objectName?: string;
    mbean?: OptimisedMBeanInfo;
    propertyList?: PropertyList;
    defaultExpanded?: boolean;
    /**
     * A new node
     * @constructor
     * @param {MBeanNode|null} parent - The parent of the new node. Otherwise, for a singleton node use null.
     * @param {string} name - The name of the new node.
     * @param {boolean} folder - Whether this new node is a folder, ie. has children
     */
    constructor(parent: MBeanNode | null, name: string, folder: boolean);
    private generateId;
    initId(recursive: boolean): void;
    populateMBean(propList: string, mbean: OptimisedMBeanInfo): void;
    private createMBeanNode;
    private configureMBean;
    private applyCanInvoke;
    /**
     * Copy the node to a new node with the given name, transferring the icons, children,
     * metadata, and MBean info.
     */
    copyTo(name: string): MBeanNode;
    /**
     * Find children with the given name. There can be at most two nodes with the
     * same name, one as an MBean and the other as a folder.
     *
     * Think about the following case:
     * - MBean1: 'com.example:type=Example,name=App'
     * - MBean2: 'com.example:type=Example,name=App,sub=Part1'
     * - MBean3: 'com.example:type=Example,name=App,sub=Part2'
     * In this case, there can be two nodes with the same name 'App', one is MBean1,
     * and the other is the folder that contains MBean2 and MBean3.
     */
    findChildren(name: string): MBeanNode[];
    /**
     * Return a child node with the given name or null. The 'folder' parameter is
     * required to identify a single node, as there can be at most two nodes with
     * the same name, one as an MBean and the other as a folder.
     *
     * See the JSDoc comment for the findChildren(name: string) method for more detail.
     */
    get(name: string, folder: boolean): MBeanNode | null;
    getIndex(index: number): MBeanNode | null;
    getChildren(): MBeanNode[];
    create(name: string, folder: boolean): MBeanNode;
    getOrCreate(name: string, folder: boolean): MBeanNode;
    removeChildren(): MBeanNode[];
    removeChild(child: MBeanNode): MBeanNode | null;
    childCount(): number;
    getType(): string | undefined;
    setType(type: string): void;
    getMetadata(key: string): string | undefined;
    addMetadata(key: string, value: string): void;
    getProperty(key: string): string | undefined;
    static sorter(a: MBeanNode, b: MBeanNode): number;
    sort(recursive: boolean): void;
    path(): string[];
    navigate(...namePath: string[]): MBeanNode | null;
    /**
     * Perform a function on each node in the given path
     * where the namePath drills down to descendants from
     * this node
     */
    forEach(namePath: string[], eachFn: (node: MBeanNode) => void): void;
    /**
     * Searches this node and all its descendants for the first node to match the filter.
     */
    find(filter: MBeanNodeFilterFn): MBeanNode | null;
    private findByNamePattern;
    /**
     * Finds MBeans in this node and all its descendants based on the properties.
     */
    findMBeans(properties: Record<string, string>): MBeanNode[];
    /**
     * Matches the node with the given MBean properties.
     * Since only MBean node holds the properties, this method always returns false
     * when invoked on a folder node.
     */
    match(properties: Record<string, string>): boolean;
    /**
     * Returns the chain of nodes forming the tree branch of ancestors
     * @method findAncestors
     * @for Node
     * @return {MBeanNode[]}
     */
    findAncestors(): MBeanNode[];
    /**
     * Returns the first node in the tree branch of ancestors that satisfies the given filter
     * @method findAncestor
     * @for Node
     * @return {MBeanNode}
     */
    findAncestor(filter: MBeanNodeFilterFn): MBeanNode | null;
    filterClone(filter: MBeanNodeFilterFn): MBeanNode | null;
    adopt(child: MBeanNode): void;
    /**
     * Recursive method to flatten MBeans.
     */
    flatten(mbeans: Record<string, MBeanNode>): void;
    /**
     * Returns true if RBACDecorator has been already applied to this node at server side.
     * If the node doesn't have mbean or mbean.op, it always returns true.
     * https://github.com/hawtio/hawtio/blob/main/platforms/hawtio-osgi-jmx/src/main/java/io/hawt/osgi/jmx/RBACDecorator.java
     */
    isRBACDecorated(): boolean;
    updateCanInvoke(canInvoke: boolean): void;
    setIcons(icon: React__default.ReactNode, expandedIcon?: React__default.ReactNode): void;
    /**
     * Returns true only if all the given operations exist in this MBean node.
     */
    hasOperations(...names: string[]): boolean;
    /**
     * Returns true only if all the given methods can be invoked.
     */
    hasInvokeRights(...methods: string[]): boolean;
    /**
     * Returns true only if all relevant operations can be invoked.
     */
    private resolveCanInvokeInOps;
    private resolveCanInvoke;
}
declare class PropertyList {
    private domain;
    private propList;
    private properties;
    private paths;
    typeName?: string;
    serviceName?: string;
    private readonly propRegex;
    constructor(domain: MBeanNode, propList: string);
    private parse;
    private parseProperty;
    /**
     * Reorders paths when they aren't in the correct order.
     */
    private maybeReorderPaths;
    get(key: string): string | undefined;
    match(properties: Record<string, string>): boolean;
    getPaths(): string[];
    objectName(): string;
}

/**
 * The object representation of MBean tree.
 * Internally, it is constructed of MBeanNode[].
 */
declare class MBeanTree {
    private id;
    private tree;
    static createEmpty(id: string): MBeanTree;
    static createFromDomains(id: string, domains: OptimisedJmxDomains): Promise<MBeanTree>;
    static createFromNodes(id: string, nodes: MBeanNode[]): MBeanTree;
    static filter(originalTree: MBeanNode[], filter: MBeanNodeFilterFn): MBeanNode[];
    private constructor();
    private populate;
    private populateDomain;
    private getOrCreateNode;
    private sortTree;
    getTree(): MBeanNode[];
    get(name: string): MBeanNode | null;
    isEmpty(): boolean;
    /**
     * Searches the entire tree for the first MBean node to match the filter.
     */
    find(filter: MBeanNodeFilterFn): MBeanNode | null;
    /**
     * Finds MBeans in the tree based on the domain name and properties.
     */
    findMBeans(domainName: string, properties: Record<string, string>): MBeanNode[];
    private descendByPathEntry;
    navigate(...namePath: string[]): MBeanNode | null;
    /**
     * Perform a function on each node in the given path
     * where the namePath drills down to descendants of this tree
     */
    forEach(namePath: string[], eachFn: (node: MBeanNode) => void): void;
    /**
     * Flattens the tree of nested folder and MBean nodes into a map of object names and MBeans.
     */
    flatten(): Record<string, MBeanNode>;
}

type TreeProcessor = (tree: MBeanTree) => Promise<void>;
type TreeProcessors = {
    [name: string]: TreeProcessor;
};
interface ITreeProcessorRegistry {
    add(name: string, processor: TreeProcessor): void;
    process(tree: MBeanTree): Promise<void>;
    getProcessors(): TreeProcessors;
    reset(): void;
}
declare class TreeProcessorRegistry implements ITreeProcessorRegistry {
    private processors;
    add(name: string, processor: TreeProcessor): void;
    process(tree: MBeanTree): Promise<void>;
    getProcessors(): TreeProcessors;
    reset(): void;
}
declare const treeProcessorRegistry: TreeProcessorRegistry;

declare const DEFAULT_MAX_DEPTH = 7;
declare const DEFAULT_MAX_COLLECTION_SIZE = 50000;
declare const DEFAULT_UPDATE_RATE = 5000;
declare const DEFAULT_AUTO_REFRESH = false;
declare enum JolokiaListMethod {
    /** The default LIST+EXEC Jolokia operations. */
    DEFAULT = 0,
    /** The optimised list operations provided by Hawtio RBACRegistry MBean. */
    OPTIMISED = 1,
    /** Not determined. */
    UNDETERMINED = 2
}
type OptimisedListResponse = {
    cache: OptimisedMBeanInfoCache;
    domains: CacheableOptimisedJmxDomains;
};
type OptimisedMBeanInfoCache = Record<string, OptimisedMBeanInfo>;
type CacheableOptimisedJmxDomains = Record<string, CacheableOptimisedJmxDomain>;
type CacheableOptimisedJmxDomain = Record<string, OptimisedMBeanInfo | string>;
type JolokiaConfig = {
    method: JolokiaListMethod;
    mbean: string;
};
type JolokiaStoredOptions = {
    maxDepth: number;
    maxCollectionSize: number;
};
declare const STORAGE_KEY_JOLOKIA_OPTIONS = "connect.jolokia.options";
declare const STORAGE_KEY_UPDATE_RATE = "connect.jolokia.updateRate";
declare const STORAGE_KEY_AUTO_REFRESH = "connect.jolokia.autoRefresh";
type AttributeValues = Record<string, unknown>;
interface IJolokiaService {
    reset(): void;
    getJolokiaUrl(): Promise<string | null>;
    getJolokia(): Promise<Jolokia>;
    getListMethod(): Promise<JolokiaListMethod>;
    getFullJolokiaUrl(): Promise<string>;
    list(options?: ListRequestOptions): Promise<OptimisedJmxDomains>;
    sublist(paths: string | string[], options?: ListRequestOptions): Promise<OptimisedJmxDomains>;
    readAttributes(mbean: string): Promise<AttributeValues>;
    readAttribute(mbean: string, attribute: string): Promise<unknown>;
    execute(mbean: string, operation: string, args?: unknown[]): Promise<unknown>;
    search(mbeanPattern: string): Promise<string[]>;
    bulkRequest(requests: Request[]): Promise<Response[]>;
    register(request: Request, callback: (response: Response | ErrorResponse) => void): Promise<number>;
    unregister(handle: number): void;
    loadUpdateRate(): number;
    saveUpdateRate(value: number): void;
    loadAutoRefresh(): boolean;
    saveAutoRefresh(value: boolean): void;
    loadJolokiaStoredOptions(): JolokiaStoredOptions;
    saveJolokiaStoredOptions(options: JolokiaStoredOptions): void;
}
declare class JolokiaService implements IJolokiaService {
    private jolokiaUrl?;
    private jolokia?;
    private config;
    reset(): void;
    /**
     * Get the Jolokia URL that the service is connected to.
     *
     * The URL may not be a full URL including origin (`http(s)://host:port`).
     * It can be a path relative to the root (`/hawtio/jolokia`) or to the current
     * path (`jolokia`).
     *
     * @see Use {@link getFullJolokiaUrl} for getting the full URL.
     */
    getJolokiaUrl(): Promise<string | null>;
    getJolokia(): Promise<Jolokia>;
    private initJolokiaUrl;
    private tryProbeJolokiaPath;
    private createJolokia;
    private beforeSend;
    private ajaxError;
    /**
     * Queries available server-side MBean to check if we can call optimised `jolokia.list()`
     * operation.
     *
     * @param jolokia Jolokia instance to use
     */
    protected checkListOptimisation(jolokia: Jolokia): Promise<void>;
    private loadJolokiaOptions;
    /**
     * Get the full Jolokia URL that the service is connected to.
     *
     * The origin part (`http(s)://host:port`) is resolved based on `window.location`.
     *
     * @see {@link getJolokiaUrl}
     */
    getFullJolokiaUrl(): Promise<string>;
    getListMethod(): Promise<JolokiaListMethod>;
    list(options?: ListRequestOptions): Promise<OptimisedJmxDomains>;
    sublist(paths: string | string[], options?: ListRequestOptions): Promise<OptimisedJmxDomains>;
    private doList;
    /**
     * Detects whether the given response comes from optimised or default list and
     * restores its shape to the standard list response of type {@link OptimisedJmxDomains}.
     *
     * @param response response value from Jolokia LIST
     * @param path optional path information to restore the response to {@link OptimisedJmxDomains}
     */
    unwindListResponse(response: unknown, path?: string[]): OptimisedJmxDomains;
    private bulkList;
    private mergeDomains;
    readAttributes(mbean: string): Promise<AttributeValues>;
    readAttribute(mbean: string, attribute: string): Promise<unknown>;
    writeAttribute(mbean: string, attribute: string, value: unknown): Promise<unknown>;
    execute(mbean: string, operation: string, args?: unknown[]): Promise<unknown>;
    search(mbeanPattern: string): Promise<string[]>;
    bulkRequest(requests: Request[]): Promise<Response[]>;
    register(request: Request, callback: (response: Response) => void): Promise<number>;
    unregister(handle: number): Promise<void>;
    loadUpdateRate(): number;
    saveUpdateRate(value: number): void;
    loadAutoRefresh(): boolean;
    saveAutoRefresh(value: boolean): void;
    loadJolokiaStoredOptions(): JolokiaStoredOptions;
    saveJolokiaStoredOptions(options: JolokiaStoredOptions): void;
}
declare const jolokiaService: JolokiaService;

declare const Operations: React__default.FunctionComponent;

interface IWorkspace {
    refreshTree(): Promise<void>;
    getTree(): Promise<MBeanTree>;
    hasMBeans(): Promise<boolean>;
    treeContainsDomainAndProperties(domainName: string, properties?: Record<string, unknown>): Promise<boolean>;
    findMBeans(domainName: string, properties: Record<string, unknown>): Promise<MBeanNode[]>;
}
declare const workspace: IWorkspace;

declare const ADD = "ADD";
declare const UPDATE = "UPDATE";
declare const DELETE = "DELETE";
declare const IMPORT = "IMPORT";
declare const RESET = "RESET";
type ConnectionsAction = {
    type: typeof ADD;
    connection: Connection;
} | {
    type: typeof UPDATE;
    id: string;
    connection: Connection;
} | {
    type: typeof DELETE;
    id: string;
} | {
    type: typeof IMPORT;
    connections: Connection[];
} | {
    type: typeof RESET;
};
declare function reducer(state: Connections, action: ConnectionsAction): Connections;

declare const connect: HawtioPlugin;

declare const jmx: HawtioPlugin;

declare const logs: HawtioPlugin;

declare const quartz: HawtioPlugin;

declare const rbac: HawtioPlugin;

declare const runtime: HawtioPlugin;

declare const springboot: HawtioPlugin;

/**
 * Custom React hook for using a selected node from JMX plugin.
 */
declare function usePluginNodeSelected(): {
    selectedNode: MBeanNode | null;
    setSelectedNode: React$1.Dispatch<React$1.SetStateAction<MBeanNode | null>>;
};
type PluginNodeSelectionContext = {
    selectedNode: MBeanNode | null;
    setSelectedNode: (selectedNode: MBeanNode | null) => void;
};
declare const PluginNodeSelectionContext: React$1.Context<PluginNodeSelectionContext>;

/**
 * Registers the builtin plugins for Hawtio React.
 *
 * The order of loading the builtin plugins is defined by this function.
 */
declare const registerPlugins: HawtioPlugin;

type Preferences = {
    id: string;
    title: string;
    component: React__default.ComponentType<any>;
    order: number;
};
declare class PreferencesRegistry {
    private preferences;
    add(id: string, title: string, component: React__default.ComponentType<any>, order?: number): void;
    getPreferences(): Preferences[];
    reset(): void;
}
declare const preferencesRegistry: PreferencesRegistry;

declare const HawtioLoadingPage: React__default.FunctionComponent;

export { ADD, type AboutConfig, type AboutProductInfo, AttributeModal, AttributeTable, type AttributeValues, Attributes, type BrandingConfig, type CacheableOptimisedJmxDomain, type CacheableOptimisedJmxDomains, Chart, type ChildLogger, type ConnectStatus, type Connection, type ConnectionCredentials, type ConnectionTestResult, type Connections, type ConnectionsAction, DEFAULT_APP_NAME, DEFAULT_AUTO_REFRESH, DEFAULT_LOGIN_TITLE, DEFAULT_MAX_COLLECTION_SIZE, DEFAULT_MAX_DEPTH, DEFAULT_UPDATE_RATE, DELETE, type DisabledRoutes, EVENT_LOGIN, EVENT_LOGOUT, EVENT_NOTIFY, EVENT_PLUGINS_UPDATED, EVENT_REFRESH, type EventListener, type FetchUserHook, HAWTCONFIG_JSON, type Hawtconfig, Hawtio, HawtioEmptyCard, type HawtioEvent, HawtioLoadingCard, HawtioLoadingPage, type HawtioLogger, type HawtioPlugin, type HawtioProps, type HawtioRemote, type HeaderItem, type Help, type IConnectService, type IEventService, type IJolokiaService, IMPORT, INITIAL_CONNECTION, type ITreeProcessorRegistry, type IUserService, type IWorkspace, Icons, type JmxConfig, JmxContentMBeans, type JolokiaConfig, JolokiaListMethod, type JolokiaStoredOptions, Logger, type LoginConfig, type LoginLink, type LoginResult, type LogoutHook, MBEAN_NODE_ID_SEPARATOR, MBeanNode, type MBeanNodeFilterFn, MBeanTree, type Notification, type NotificationListener, type NotificationType, type OnlineConfig, Operations, type OptimisedJmxDomain, type OptimisedJmxDomains, type OptimisedListResponse, type OptimisedMBeanAttribute, type OptimisedMBeanInfo, type OptimisedMBeanInfoCache, type OptimisedMBeanOperation, type OptimisedMBeanOperations, PARAM_KEY_CONNECTION, PARAM_KEY_REDIRECT, PUBLIC_USER, type Plugin, PluginNodeSelectionContext, PluginTreeViewToolbar, type Preferences, PropertyList, RESET, type ResolveUser, SESSION_KEY_CURRENT_CONNECTION, STORAGE_KEY_AUTO_REFRESH, STORAGE_KEY_CHILD_LOGGERS, STORAGE_KEY_JOLOKIA_OPTIONS, STORAGE_KEY_LOG_LEVEL, STORAGE_KEY_UPDATE_RATE, type TreeProcessor, type TreeProcessors, UPDATE, type UniversalHeaderItem, type User, __testing__, camel, configManager, connect, connectService, eventService, hawtio, helpRegistry, isJmxDomain, isJmxDomains, isMBeanInfo, isMBeanInfoError, isUniversalHeaderItem, jmx, jolokiaService, keycloak, logs, oidc, preferencesRegistry, quartz, rbac, reducer, registerPlugins, runtime, springboot, treeProcessorRegistry, useHawtconfig, usePluginNodeSelected, usePlugins, useUser, userService, workspace };
