export type SubscriptionRuleResultType = "xray" | "v2ray" | "sing-box" | "clash" | "clash-meta" | "block"

export type SubscriptionRuleType = {
    pattern: string,
    result: SubscriptionRuleResultType
}
