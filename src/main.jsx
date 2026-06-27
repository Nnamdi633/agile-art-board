import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createRoot } from "react-dom/client";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Settings, ChevronLeft, ChevronRight, X, Loader2, AlertTriangle, CheckCircle2, Activity, BarChart3, TrendingUp, RefreshCw, Eye, EyeOff, Search } from "lucide-react";

// ─── LOGO (base64 embedded) ─────────────────────────────────────────────────
const STERLING_LOGO = "data:image/png;base64," + "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";

// ─── CREDENTIAL STORAGE (obfuscated in localStorage) ─────────────────────────
const CRED_KEY = "sfh_art_cred_v1";
function saveCredentials(config) {
  try {
    const encoded = btoa(JSON.stringify({ d: config.domain, e: config.email, t: config.token }));
    localStorage.setItem(CRED_KEY, encoded);
  } catch (e) { console.warn("Could not save credentials:", e); }
}
function loadCredentials() {
  try {
    const stored = localStorage.getItem(CRED_KEY);
    if (!stored) return null;
    const decoded = JSON.parse(atob(stored));
    return { domain: decoded.d || "", email: decoded.e || "", token: decoded.t || "" };
  } catch (e) { return null; }
}
function clearCredentials() {
  try { localStorage.removeItem(CRED_KEY); } catch(e) {}
}

// ─── FAVICON SETTER ──────────────────────────────────────────────────────────
function setFavicon(url) {
  let link = document.querySelector("link[rel*='icon']");
  if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
  link.href = url;
}

// ─── CONFIGURATION ───────────────────────────────────────────────────────────
const ART_CONFIG = {
  sterling: {
    label: "Sterling Bank",
    color: "#0EA5E9",
    arts: [
      { name: "Backoffice ART", short: "BOA", key: "BOA", boards: [114,113,111,104,417,112] },
      { name: "Digital Channels ART", short: "DCAF", key: "DCAF", boards: [128,93,92,70,94,71,72,91,218] },
      { name: "Digital Lending ART", short: "DLSA", key: "DLSA", boards: [204,158,681,212,156] },
      { name: "Investment Solutions ART", short: "ISAB", key: "ISAB", boards: [131,219,116,285] },
      { name: "Integration & Partnerships ART", short: "IN", key: "IN", boards: [215,135] },
      { name: "Feature Channels ART", short: "FTC", key: "FTC", boards: [96] },
    ],
  },
  altbank: {
    label: "Alternative Bank",
    color: "#F59E0B",
    arts: [
      { name: "Backoffice ART", short: "BAT", key: "BAT", boards: [155] },
      { name: "Digital Channels ART", short: "DCAB", key: "DCAB", boards: [163,176,173,169,175] },
      { name: "Digital Lending ART", short: "DLSTA", key: "DLSTA", boards: [181,188,187] },
      { name: "Investment Solutions ART", short: "IST", key: "IST", boards: [195,196] },
      { name: "Integration & Partnerships ART", short: "IPT", key: "IPT", boards: [193] },
      { name: "Feature Channels ART", short: "FEAT", key: "FEAT", boards: [211] },
    ],
  },
  shared: {
    label: "Shared Services",
    color: "#8B5CF6",
    arts: [
      { name: "AI and Research", short: "AR", key: "AR", boards: [549] },
      { name: "Productivity & Automation ART", short: "PROD", key: "PROD", boards: [483,136,140,141] },
      { name: "Data Engineering Projects", short: "DEP", key: "DEP", boards: [615] },
    ],
  },
};

const UNPLANNED_TYPES = ["Production Fix", "Regulatory request", "ISG Vulnerability Fix"];
const REQUEST_TYPE_FIELD = "customfield_10507";
const BOTTLENECK_STATUSES = [
  "Ready for coding","Coding in progress","In review","Ready for QA",
  "Deployed to QA","Functional testing","Security testing","QA completed",
  "Awaiting CAB approval","Deployed to pilot","Deployed to prod"
];

const ALL_ARTS = [
  ...ART_CONFIG.sterling.arts.map(a => ({ ...a, bank: "sterling", bankLabel: "Sterling Bank", bankColor: ART_CONFIG.sterling.color })),
  ...ART_CONFIG.altbank.arts.map(a => ({ ...a, bank: "altbank", bankLabel: "Alternative Bank", bankColor: ART_CONFIG.altbank.color })),
  ...ART_CONFIG.shared.arts.map(a => ({ ...a, bank: "shared", bankLabel: "Shared Services", bankColor: ART_CONFIG.shared.color })),
];

// ─── JIRA API SERVICE ────────────────────────────────────────────────────────
class JiraService {
  constructor(domain, email, token) {
    let cleaned = domain.trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");
    if (!cleaned.includes(".atlassian.net")) cleaned = `${cleaned}.atlassian.net`;
    this.domain = cleaned;
    this.headers = {
      Authorization: `Basic ${btoa(`${email.trim()}:${token.trim()}`)}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Jira-Domain": cleaned,
    };
  }

  async apiFetch(path) {
    const url = `/api/jira${path}`;
    const res = await fetch(url, { headers: this.headers });
    if (res.status === 401) throw new Error("AUTH_FAILED: Invalid email or API token. Check your Jira credentials.");
    if (res.status === 403) throw new Error("FORBIDDEN: Your API token lacks permission. Ensure it has read access to these boards.");
    if (res.status === 404) {
      let body = ""; try { body = await res.text(); } catch(e) {}
      throw new Error(`NOT_FOUND: ${path} — Jira returned 404. Body: ${body.slice(0, 200)}`);
    }
    if (!res.ok) throw new Error(`Jira API error ${res.status}: ${res.statusText} for ${path}`);
    return res.json();
  }

  async testConnection() {
    return this.apiFetch("/rest/api/3/myself");
  }

  async getBoardSprints(boardId) {
    const allSprints = [];
    let startAt = 0;
    let isLast = false;
    while (!isLast) {
      const data = await this.apiFetch(`/rest/agile/1.0/board/${boardId}/sprint?maxResults=50&startAt=${startAt}`);
      allSprints.push(...(data.values || []));
      isLast = data.isLast !== false;
      startAt += 50;
    }
    return allSprints;
  }

  async getSprintIssues(sprintId, projectKey) {
    const allIssues = [];
    let startAt = 0;
    let total = 1;
    while (startAt < total) {
      const jql = encodeURIComponent(`project="${projectKey}" AND issuetype=Epic AND sprint=${sprintId}`);
      const fields = `key,summary,status,${REQUEST_TYPE_FIELD}`;
      const data = await this.apiFetch(`/rest/api/3/search/jql?jql=${jql}&fields=${fields}&maxResults=100&startAt=${startAt}`);
      console.log(`[JiraService] Sprint ${sprintId} / ${projectKey}: found ${data.total || 0} epics`);
      allIssues.push(...(data.issues || []));
      total = data.total || 0;
      startAt += 100;
    }
    return allIssues;
  }

  async getIssueChangelog(issueKey) {
    // Try dedicated changelog endpoint first (Jira v3), fall back to expand=changelog
    try {
      const data = await this.apiFetch(`/rest/api/3/issue/${issueKey}/changelog?maxResults=100`);
      return data.values || [];
    } catch (e) {
      // Fallback to expand approach
      const data = await this.apiFetch(`/rest/api/3/issue/${issueKey}?expand=changelog`);
      return data.changelog?.histories || [];
    }
  }

  async getIssueDetails(issueKey) {
    const data = await this.apiFetch(`/rest/api/3/issue/${issueKey}?expand=changelog&fields=key,summary,status,description,project,${REQUEST_TYPE_FIELD},customfield_10020,created,updated`);
    const histories = data.changelog?.histories || [];
    histories.sort((a, b) => new Date(a.created) - new Date(b.created));

    // Extract sprint history
    const sprintField = data.fields?.customfield_10020 || [];
    const sprintHistory = sprintField.map(s => ({
      name: s.name, state: s.state, boardId: s.boardId,
      startDate: s.startDate, endDate: s.endDate, completeDate: s.completeDate,
    }));

    // Extract last 5 activities
    const recentActivities = histories.slice(-5).reverse().map(h => ({
      date: h.created,
      author: h.author?.displayName || "Unknown",
      changes: (h.items || []).map(item => ({
        field: item.field,
        from: item.fromString || "(none)",
        to: item.toString || "(none)",
      })),
    }));

    // Extract description text
    let description = "";
    try {
      const desc = data.fields?.description;
      if (typeof desc === "string") description = desc;
      else if (desc?.content) {
        description = desc.content.map(block =>
          (block.content || []).map(c => c.text || "").join("")
        ).join("\n");
      }
    } catch(e) { description = ""; }

    return {
      key: data.key,
      summary: data.fields?.summary || "",
      status: data.fields?.status?.name || "Unknown",
      description,
      requestType: data.fields?.[REQUEST_TYPE_FIELD]?.value || data.fields?.[REQUEST_TYPE_FIELD]?.name || "N/A",
      project: data.fields?.project?.name || "Unknown",
      projectKey: data.fields?.project?.key || "",
      created: data.fields?.created,
      updated: data.fields?.updated,
      sprintHistory,
      recentActivities,
    };
  }
}

// ─── PI & SPRINT PARSING ─────────────────────────────────────────────────────
function parsePIFromSprint(sprintName) {
  const match = sprintName.match(/^(PI\s*\d+\s+\d{4})/i);
  if (!match) return null;
  return match[1]
    .replace(/^PI\s*/i, "PI ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanSprintName(sprintName) {
  const match = sprintName.match(/(sprint\s*\d+)/i);
  if (match) return match[1].replace(/sprint\s*/i, "Sprint ");
  return sprintName
    .replace(/^PI\s*\d+\s+\d{4}\s*[-,.:]\s*/i, "")
    .replace(/^PI\s*\d+\s+\d{4}\s+/i, "")
    .trim() || sprintName;
}

function parseSprintNumber(sprintName) {
  const match = sprintName.match(/Sprint\s*(\d+)/i);
  return match ? parseInt(match[1]) : 0;
}

function sortBySprint(a, b) {
  return parseSprintNumber(a.name) - parseSprintNumber(b.name);
}

// ─── MOCK DATA GENERATOR ────────────────────────────────────────────────────
function generateMockData() {
  const pis = ["PI 1 2026", "PI 2 2026"];
  const sprintsPerPI = 5;
  const statuses = ["To Do","Ready for coding","Coding in progress","In review","Ready for QA","Deployed to QA","Functional testing","Security testing","QA completed","Awaiting CAB approval","Deployed to pilot","Deployed to prod"];
  const requestTypes = ["Feature Request","Enhancement","Production Fix","Regulatory request","ISG Vulnerability Fix","Technical Debt","New Feature"];

  const data = {};
  for (const pi of pis) {
    data[pi] = {};
    for (const art of ALL_ARTS) {
      const sprints = [];
      for (let s = 1; s <= sprintsPerPI; s++) {
        const sprintName = `${pi} - Sprint ${s}`;
        const isOpen = pi === "PI 2 2026" && s === 3;
        const isClosed = pi === "PI 1 2026" || s < 3;
        const numEpics = 8 + Math.floor(Math.random() * 12);
        const epics = [];
        for (let e = 0; e < numEpics; e++) {
          const reqType = requestTypes[Math.floor(Math.random() * requestTypes.length)];
          const statusIdx = isClosed ? statuses.length - 1 : Math.floor(Math.random() * statuses.length);
          epics.push({
            key: `${art.key}-${100 + s * 20 + e}`,
            summary: `${["Implement","Fix","Upgrade","Migrate","Refactor","Build","Deploy","Optimize"][Math.floor(Math.random()*8)]} ${["payment gateway","user auth","dashboard","reporting","notifications","API","database","cache"][Math.floor(Math.random()*8)]} ${["module","service","flow","integration","pipeline","endpoint"][Math.floor(Math.random()*6)]}`,
            status: statuses[statusIdx],
            requestType: reqType,
            timeInStatus: Object.fromEntries(
              BOTTLENECK_STATUSES.map(st => [st, Math.floor(Math.random() * 72) + 1])
            ),
          });
        }
        sprints.push({
          id: Math.floor(Math.random() * 10000),
          name: sprintName,
          state: isOpen ? "active" : isClosed ? "closed" : "future",
          epics,
        });
      }
      data[pi][art.key] = sprints;
    }
  }
  return { pis, data, activePi: "PI 2 2026" };
}

// ─── METRIC CALCULATIONS ─────────────────────────────────────────────────────
function calcMetrics(epics) {
  const total = epics.length;
  const delivered = epics.filter(e => (e.status || "").toLowerCase() === "deployed to prod").length;
  const planned = total;
  const unplanned = epics.filter(e => UNPLANNED_TYPES.some(t => t.toLowerCase() === (e.requestType || "").toLowerCase())).length;
  return { total, delivered, planned, unplanned };
}

function getSprintTrendData(sprints) {
  return sprints.map(s => {
    const m = calcMetrics(s.epics);
    return {
      name: cleanSprintName(s.name),
      planned: m.planned,
      delivered: m.delivered,
      unplanned: m.unplanned,
      state: s.state,
    };
  }).sort(sortBySprint);
}

function calcBottleneck(epics) {
  return BOTTLENECK_STATUSES.map(status => {
    const key = status.toLowerCase();
    const times = epics.map(e => e.timeInStatus?.[key] || 0).filter(t => t > 0);
    const avg = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    return { status: status.length > 14 ? status.slice(0, 13) + "…" : status, fullStatus: status, hours: Math.round(avg * 10) / 10 };
  });
}

function calcDeliveryAggregates(allPiData, artKey, currentPi) {
  const rows = [];
  if (!allPiData) return rows;
  for (const [pi, artMap] of Object.entries(allPiData)) {
    const sprints = artMap[artKey] || [];
    for (const sprint of sprints) {
      if (sprint.state === "future") continue;
      const m = calcMetrics(sprint.epics);
      rows.push({
        pi,
        sprint: cleanSprintName(sprint.name),
        total: m.total,
        delivered: m.delivered,
        pct: m.total > 0 ? Math.round((m.delivered / m.total) * 100) : 0,
        isOpen: sprint.state === "active",
        isCurrent: pi === currentPi,
      });
    }
  }
  return rows.filter(r => r.isCurrent || r.pi !== currentPi);
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const theme = {
  bg: "#0B1120",
  card: "#111827",
  cardBorder: "#1E293B",
  surface: "#1A2332",
  text: "#E2E8F0",
  textMuted: "#94A3B8",
  textDim: "#64748B",
  accent: "#0EA5E9",
  accentAlt: "#06B6D4",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#8B5CF6",
  pink: "#EC4899",
  grid: "#1E293B",
  tooltipBg: "#1E293B",
};

// ─── INSIGHT GENERATOR ───────────────────────────────────────────────────────
function generateInsights(art, sprints, trendData, bottleneckData, deliveryRows, metrics) {
  const insights = [];
  const epics = sprints.find(s => s.state === "active")?.epics || [];
  const m = metrics;

  // 1. Delivery rate analysis
  const deliveryPct = m.total > 0 ? Math.round((m.delivered / m.total) * 100) : 0;
  if (deliveryPct < 30) {
    insights.push({ type: "danger", text: `Only ${deliveryPct}% delivered in open sprint (${m.delivered}/${m.total}). Escalate blockers immediately and consider descoping low-priority items.` });
  } else if (deliveryPct < 60) {
    insights.push({ type: "warning", text: `${deliveryPct}% delivery rate so far. Review remaining ${m.total - m.delivered} items for achievability before sprint end.` });
  } else {
    insights.push({ type: "success", text: `Strong ${deliveryPct}% delivery rate. ${m.total - m.delivered} items remaining — on track for sprint completion.` });
  }

  // 2. Unplanned ratio
  const unplannedPct = m.total > 0 ? Math.round((m.unplanned / m.total) * 100) : 0;
  if (unplannedPct > 40) {
    insights.push({ type: "danger", text: `${unplannedPct}% of sprint is unplanned work (${m.unplanned} items). Excessive reactive work — investigate root causes of production fixes and regulatory requests.` });
  } else if (unplannedPct > 20) {
    insights.push({ type: "warning", text: `${unplannedPct}% unplanned items. Consider allocating a buffer capacity for unplanned work in future sprint planning.` });
  } else {
    insights.push({ type: "success", text: `Low unplanned ratio (${unplannedPct}%). Good sprint discipline — planned work is not being displaced.` });
  }

  // 3. Bottleneck analysis
  const sortedBottleneck = [...bottleneckData].sort((a, b) => b.hours - a.hours);
  const topBottleneck = sortedBottleneck[0];
  if (topBottleneck && topBottleneck.hours > 0) {
    const secondWorst = sortedBottleneck[1];
    if (topBottleneck.hours > 48) {
      insights.push({ type: "danger", text: `"${topBottleneck.fullStatus}" is a critical bottleneck at ${topBottleneck.hours}h avg. Assign dedicated capacity to unblock this stage.` });
    } else if (topBottleneck.hours > 24) {
      insights.push({ type: "warning", text: `"${topBottleneck.fullStatus}" averaging ${topBottleneck.hours}h. ${secondWorst ? `Followed by "${secondWorst.fullStatus}" at ${secondWorst.hours}h.` : ""} Consider parallel processing or automation.` });
    } else {
      insights.push({ type: "success", text: `No major bottlenecks. Longest wait is "${topBottleneck.fullStatus}" at ${topBottleneck.hours}h — workflow is flowing well.` });
    }
  }

  // 4. Sprint-over-sprint trend
  if (trendData.length >= 2) {
    const recent = trendData[trendData.length - 1];
    const prev = trendData[trendData.length - 2];
    const deliveryTrend = recent.delivered - prev.delivered;
    const scopeTrend = recent.planned - prev.planned;
    if (scopeTrend > 3 && deliveryTrend < scopeTrend) {
      insights.push({ type: "warning", text: `Scope grew by ${scopeTrend} items vs previous sprint but delivery only increased by ${deliveryTrend}. Avoid overcommitting — right-size sprint capacity.` });
    } else if (deliveryTrend > 0) {
      insights.push({ type: "success", text: `Delivery improving: +${deliveryTrend} items vs previous sprint. Maintain this momentum and document what's working.` });
    } else if (deliveryTrend < -2) {
      insights.push({ type: "danger", text: `Delivery dropped by ${Math.abs(deliveryTrend)} items vs previous sprint. Conduct a focused retrospective on what changed.` });
    } else {
      insights.push({ type: "info", text: `Delivery is flat sprint-over-sprint. Look for small process improvements to unlock incremental gains.` });
    }
  }

  // 5. Delivery aggregate trend for closed sprints
  const closedRows = deliveryRows.filter(r => !r.isOpen && r.pct > 0);
  if (closedRows.length >= 2) {
    const avgPct = Math.round(closedRows.reduce((a, r) => a + r.pct, 0) / closedRows.length);
    const worst = closedRows.reduce((min, r) => r.pct < min.pct ? r : min, closedRows[0]);
    if (avgPct < 60) {
      insights.push({ type: "danger", text: `PI average delivery is ${avgPct}%. Worst sprint: ${worst.sprint} at ${worst.pct}%. Systemic capacity or estimation issues — recalibrate velocity.` });
    } else if (avgPct < 80) {
      insights.push({ type: "warning", text: `PI average delivery at ${avgPct}%. Target 80%+. Tighten estimation accuracy using last 3 sprints as baseline.` });
    } else {
      insights.push({ type: "success", text: `Excellent PI delivery average of ${avgPct}%. Consistent execution across sprints — share practices with other ARTs.` });
    }
  } else {
    // Fallback: status distribution insight
    const stuckInQA = epics.filter(e => {
      const s = (e.status || "").toLowerCase();
      return s.includes("testing") || s.includes("qa") || s.includes("review");
    }).length;
    if (stuckInQA > m.total * 0.4) {
      insights.push({ type: "warning", text: `${stuckInQA} of ${m.total} items (${Math.round(stuckInQA/m.total*100)}%) are in testing/review stages. Prioritize QA throughput to release completed work.` });
    } else {
      insights.push({ type: "info", text: `Work is distributed across stages. Monitor items approaching "Awaiting CAB Approval" to prevent end-of-sprint pile-up.` });
    }
  }

  return insights.slice(0, 5);
}

// ─── BANK SUMMARY COLUMN ─────────────────────────────────────────────────────
function BankSummaryColumn({ bankKey, bankLabel, bankColor, trendData, bottleneckData, onClickIssues }) {
  const ttip = { background: theme.tooltipBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 8, fontSize: 11, color: theme.text };

  // Compute aggregate % delivery per sprint
  const deliveryData = trendData.map(d => ({
    name: d.name,
    pct: d.planned > 0 ? Math.round((d.delivered / d.planned) * 100) : 0,
    total: d.planned,
    delivered: d.delivered,
  }));

  const maxB = Math.max(...(bottleneckData || []).map(d => d.hours), 1);

  const MiniChart = ({ title, dk1, dk2, c1, c2, n1, n2 }) => (
    <div>
      <div style={{ fontSize: 10, color: theme.textMuted, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 }}>{title}</div>
      <ResponsiveContainer width="100%" height={90}>
        <LineChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis dataKey="name" tick={{ fontSize: 8, fill: theme.textDim }} />
          <YAxis tick={{ fontSize: 8, fill: theme.textDim }} />
          <Tooltip contentStyle={ttip} />
          <Legend wrapperStyle={{ fontSize: 8, paddingTop: 2 }} iconSize={6} />
          <Line type="monotone" dataKey={dk1} stroke={c1} strokeWidth={2} dot={{ r: 2 }} name={n1} />
          <Line type="monotone" dataKey={dk2} stroke={c2} strokeWidth={2} dot={{ r: 2 }} name={n2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div style={{
      background: theme.card, border: `1px solid ${theme.cardBorder}`, borderRadius: 14,
      borderTop: `3px solid ${bankColor}`, flex: "1 1 0", minWidth: 280, maxWidth: 400,
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      <div onClick={onClickIssues} style={{ padding: "12px 16px 8px", borderBottom: `1px solid ${theme.cardBorder}`, cursor: "pointer" }}
        onMouseEnter={e => { e.currentTarget.style.background = theme.surface; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>{bankLabel}</div>
        <div style={{ fontSize: 10, color: theme.textDim, marginTop: 2 }}>Click to view open sprint epics</div>
      </div>
      <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", flex: 1 }}>
        <MiniChart title="Planned vs Delivered" dk1="planned" dk2="delivered" c1="#0EA5E9" c2="#10B981" n1="Planned" n2="Delivered" />
        <MiniChart title="Planned vs Unplanned" dk1="planned" dk2="unplanned" c1="#0EA5E9" c2="#F59E0B" n1="Planned" n2="Unplanned" />
        <MiniChart title="Total vs Delivered" dk1="planned" dk2="delivered" c1="#8B5CF6" c2="#10B981" n1="Total (P+U)" n2="Delivered" />

        {/* % Delivery Aggregates per Sprint */}
        <div>
          <div style={{ fontSize: 10, color: theme.textMuted, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 }}>% Delivery per Sprint</div>
          <div style={{ borderRadius: 6, border: `1px solid ${theme.cardBorder}`, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 9 }}>
              <thead>
                <tr style={{ background: theme.surface }}>
                  {["Sprint", "Total", "Delivered", "% Del"].map(h => (
                    <th key={h} style={{ padding: "4px 6px", textAlign: "left", color: theme.textDim, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deliveryData.map((d, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${theme.cardBorder}22` }}>
                    <td style={{ padding: "3px 6px", color: theme.text }}>{d.name}</td>
                    <td style={{ padding: "3px 6px", color: theme.text }}>{d.total}</td>
                    <td style={{ padding: "3px 6px", color: theme.success }}>{d.delivered}</td>
                    <td style={{ padding: "3px 6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ flex: 1, height: 5, background: theme.surface, borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ width: `${d.pct}%`, height: "100%", borderRadius: 2, background: d.pct >= 80 ? theme.success : d.pct >= 50 ? theme.warning : theme.danger }} />
                        </div>
                        <span style={{ color: d.pct >= 80 ? theme.success : d.pct >= 50 ? theme.warning : theme.danger, fontWeight: 600, fontSize: 8, minWidth: 24, textAlign: "right" }}>{d.pct}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottleneck Chart */}
        {bottleneckData && bottleneckData.some(d => d.hours > 0) && (
          <div>
            <div style={{ fontSize: 10, color: theme.textMuted, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 }}>Bottleneck (Avg Hours)</div>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={bottleneckData} margin={{ top: 5, right: 5, left: -15, bottom: 25 }} barCategoryGap="15%">
                <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
                <XAxis dataKey="status" tick={{ fontSize: 6, fill: theme.textDim }} angle={-45} textAnchor="end" interval={0} height={45} />
                <YAxis tick={{ fontSize: 7, fill: theme.textDim }} />
                <Tooltip contentStyle={ttip} formatter={(val, name, props) => [`${val}h`, props.payload.fullStatus]} />
                <Bar dataKey="hours" radius={[3, 3, 0, 0]}>
                  {bottleneckData.map((entry, i) => (
                    <Cell key={i} fill={entry.hours > maxB * 0.7 ? theme.danger : entry.hours > maxB * 0.4 ? theme.warning : bankColor} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SUB COMPONENTS ──────────────────────────────────────────────────────────

function SummaryPanel({ title, bankColor, trendData, type, onClick }) {
  const colors = type === "pvd"
    ? { line1: "#0EA5E9", line2: "#10B981", label1: "Planned", label2: "Delivered" }
    : { line1: "#0EA5E9", line2: "#F59E0B", label1: "Planned", label2: "Unplanned" };
  const dataKey1 = type === "pvd" ? "planned" : "planned";
  const dataKey2 = type === "pvd" ? "delivered" : "unplanned";

  return (
    <div onClick={onClick} style={{
      background: theme.card, border: `1px solid ${theme.cardBorder}`,
      borderRadius: 12, padding: "14px 16px", cursor: "pointer",
      borderTop: `3px solid ${bankColor}`, transition: "all 0.2s",
      flex: "1 1 0", minWidth: 200,
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = bankColor; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = theme.cardBorder; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 }}>{title}</div>
      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis dataKey="name" tick={{ fontSize: 9, fill: theme.textDim }} />
          <YAxis tick={{ fontSize: 9, fill: theme.textDim }} />
          <Tooltip contentStyle={{ background: theme.tooltipBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 8, fontSize: 11, color: theme.text }} />
          <Legend wrapperStyle={{ fontSize: 9, paddingTop: 4 }} iconSize={8} />
          <Line type="monotone" dataKey={dataKey1} stroke={colors.line1} strokeWidth={2} dot={{ r: 3 }} name={colors.label1} />
          <Line type="monotone" dataKey={dataKey2} stroke={colors.line2} strokeWidth={2} dot={{ r: 3 }} name={colors.label2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function IssueModal({ issues, title, onClose }) {
  const [tab, setTab] = useState("all");
  if (!issues) return null;

  const delivered = issues.filter(e => (e.status || "").toLowerCase() === "deployed to prod");
  const unplanned = issues.filter(e => UNPLANNED_TYPES.some(t => t.toLowerCase() === (e.requestType || "").toLowerCase()));
  const plannedOnly = issues.filter(e => !UNPLANNED_TYPES.some(t => t.toLowerCase() === (e.requestType || "").toLowerCase()));

  const tabs = [
    { key: "all", label: "All", count: issues.length, color: theme.text },
    { key: "planned", label: "Planned", count: issues.length, color: theme.accent },
    { key: "delivered", label: "Delivered", count: delivered.length, color: theme.success },
    { key: "unplanned", label: "Unplanned", count: unplanned.length, color: theme.warning },
    { key: "plannedOnly", label: "Planned (excl. unplanned)", count: plannedOnly.length, color: theme.purple },
  ];

  const filtered = tab === "delivered" ? delivered : tab === "unplanned" ? unplanned : tab === "plannedOnly" ? plannedOnly : issues;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: theme.card, border: `1px solid ${theme.cardBorder}`, borderRadius: 16, padding: 24, maxWidth: 900, width: "95%", maxHeight: "85vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ color: theme.text, margin: 0, fontSize: 16 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer", padding: 4 }}><X size={18} /></button>
        </div>

        {/* Summary counts */}
        <div style={{ display: "flex", gap: 16, marginBottom: 16, padding: "12px 16px", background: theme.surface, borderRadius: 10 }}>
          {[
            { label: "Planned (All)", val: issues.length, color: theme.accent },
            { label: "Delivered", val: delivered.length, color: theme.success },
            { label: "Unplanned", val: unplanned.length, color: theme.warning },
            { label: "Delivery %", val: issues.length > 0 ? Math.round((delivered.length / issues.length) * 100) + "%" : "0%", color: delivered.length / issues.length >= 0.8 ? theme.success : delivered.length / issues.length >= 0.5 ? theme.warning : theme.danger },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color }}>{val}</div>
              <div style={{ fontSize: 10, color: theme.textDim, textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 12, overflowX: "auto" }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "6px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
              background: tab === t.key ? `${t.color}22` : theme.surface,
              color: tab === t.key ? t.color : theme.textMuted,
              borderBottom: tab === t.key ? `2px solid ${t.color}` : "2px solid transparent",
            }}>
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr>{["Key","Summary","Status","Request Type","Category"].map(h => (
              <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: theme.textMuted, borderBottom: `1px solid ${theme.cardBorder}`, fontWeight: 600 }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>{filtered.map(issue => {
            const isDelivered = (issue.status || "").toLowerCase() === "deployed to prod";
            const isUnplanned = UNPLANNED_TYPES.some(t => t.toLowerCase() === (issue.requestType || "").toLowerCase());
            return (
              <tr key={issue.key} style={{ borderBottom: `1px solid ${theme.cardBorder}22` }}>
                <td style={{ padding: "7px 10px", color: theme.accent, fontFamily: "monospace" }}>{issue.key}</td>
                <td style={{ padding: "7px 10px", color: theme.text, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{issue.summary}</td>
                <td style={{ padding: "7px 10px" }}><StatusBadge status={issue.status} /></td>
                <td style={{ padding: "7px 10px", color: theme.textMuted }}>{issue.requestType}</td>
                <td style={{ padding: "7px 10px" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {isDelivered && <span style={{ padding: "1px 6px", borderRadius: 4, fontSize: 9, fontWeight: 600, background: `${theme.success}22`, color: theme.success }}>Delivered</span>}
                    {isUnplanned && <span style={{ padding: "1px 6px", borderRadius: 4, fontSize: 9, fontWeight: 600, background: `${theme.warning}22`, color: theme.warning }}>Unplanned</span>}
                    {!isUnplanned && <span style={{ padding: "1px 6px", borderRadius: 4, fontSize: 9, fontWeight: 600, background: `${theme.accent}22`, color: theme.accent }}>Planned</span>}
                  </div>
                </td>
              </tr>
            );
          })}</tbody>
        </table>
        {filtered.length === 0 && <p style={{ color: theme.textDim, textAlign: "center", padding: 24 }}>No issues in this category</p>}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  let bg = theme.textDim + "22";
  let color = theme.textMuted;
  if (s.includes("prod") && s.includes("deployed")) { bg = "#10B98122"; color = "#10B981"; }
  else if (s.includes("progress") || s.includes("coding")) { bg = "#0EA5E922"; color = "#0EA5E9"; }
  else if (s.includes("review") || s.includes("testing")) { bg = "#F59E0B22"; color = "#F59E0B"; }
  else if (s.includes("ready")) { bg = "#8B5CF622"; color = "#8B5CF6"; }
  return <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: bg, color, whiteSpace: "nowrap" }}>{status}</span>;
}

function ARTColumn({ art, sprints, allPiData, currentPi }) {
  // Combine ALL active sprints — different boards may be on different sprint numbers
  const activeSprints = sprints.filter(s => s.state === "active");
  const openSprintLabel = activeSprints.length > 0
    ? activeSprints.map(s => cleanSprintName(s.name)).filter((v, i, a) => a.indexOf(v) === i).join(", ")
    : "N/A";
  
  const trendData = getSprintTrendData(sprints);
  
  // Collect epics from ALL active sprints, deduplicate by key
  const epicMap = {};
  for (const s of activeSprints) {
    for (const e of (s.epics || [])) {
      if (!epicMap[e.key]) epicMap[e.key] = e;
    }
  }
  const epics = Object.values(epicMap);
  
  const planned = epics.filter(e => !UNPLANNED_TYPES.some(t => t.toLowerCase() === (e.requestType || "").toLowerCase()));
  const unplanned = epics.filter(e => UNPLANNED_TYPES.some(t => t.toLowerCase() === (e.requestType || "").toLowerCase()));
  const bottleneckData = calcBottleneck(epics);
  const deliveryRows = calcDeliveryAggregates(allPiData, art.key, currentPi);
  const m = calcMetrics(epics);

  const maxBottleneck = Math.max(...bottleneckData.map(d => d.hours), 1);

  return (
    <div style={{
      minWidth: 420, maxWidth: 460, background: theme.card,
      border: `1px solid ${theme.cardBorder}`, borderRadius: 16,
      borderTop: `3px solid ${art.bankColor}`, padding: 0, flexShrink: 0,
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${theme.cardBorder}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>{art.name}</div>
            <div style={{ fontSize: 11, color: art.bankColor, fontWeight: 600, marginTop: 2 }}>{art.bankLabel}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: theme.textDim }}>ACTIVE SPRINT{activeSprints.length > 1 ? "S" : ""}</div>
            <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600 }}>{openSprintLabel}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
          {[
            { label: "Planned", val: m.planned, color: theme.accent },
            { label: "Delivered", val: m.delivered, color: theme.success },
            { label: "Unplanned", val: m.unplanned, color: theme.warning },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color }}>{val}</div>
              <div style={{ fontSize: 9, color: theme.textDim, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "12px 16px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Planned vs Delivered Line Chart */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Planned vs Delivered</div>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: theme.textDim }} />
              <YAxis tick={{ fontSize: 9, fill: theme.textDim }} />
              <Tooltip contentStyle={{ background: theme.tooltipBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 8, fontSize: 11, color: theme.text }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="planned" stroke="#0EA5E9" strokeWidth={2} dot={{ r: 2.5 }} name="Planned" />
              <Line type="monotone" dataKey="delivered" stroke="#10B981" strokeWidth={2} dot={{ r: 2.5 }} name="Delivered" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Planned vs Unplanned Line Chart */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Planned vs Unplanned</div>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: theme.textDim }} />
              <YAxis tick={{ fontSize: 9, fill: theme.textDim }} />
              <Tooltip contentStyle={{ background: theme.tooltipBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 8, fontSize: 11, color: theme.text }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="planned" stroke="#0EA5E9" strokeWidth={2} dot={{ r: 2.5 }} name="Planned" />
              <Line type="monotone" dataKey="unplanned" stroke="#F59E0B" strokeWidth={2} dot={{ r: 2.5 }} name="Unplanned" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Planned + Unplanned vs Delivered Line Chart */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Planned + Unplanned vs Delivered</div>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: theme.textDim }} />
              <YAxis tick={{ fontSize: 9, fill: theme.textDim }} />
              <Tooltip contentStyle={{ background: theme.tooltipBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 8, fontSize: 11, color: theme.text }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="planned" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 2.5 }} name="Total (P+U)" />
              <Line type="monotone" dataKey="delivered" stroke="#10B981" strokeWidth={2} dot={{ r: 2.5 }} name="Delivered" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Planned Deliverables Table */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Planned Deliverables <span style={{ color: theme.accent, fontWeight: 700 }}>({planned.length})</span>
          </div>
          <div style={{ maxHeight: 180, overflowY: "auto", borderRadius: 8, border: `1px solid ${theme.cardBorder}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
              <thead>
                <tr style={{ background: theme.surface }}>
                  {["Key","Summary","Status","Type"].map(h => (
                    <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: theme.textDim, fontWeight: 600, position: "sticky", top: 0, background: theme.surface }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>{planned.map(e => (
                <tr key={e.key} style={{ borderBottom: `1px solid ${theme.cardBorder}22` }}>
                  <td style={{ padding: "5px 8px", color: theme.accent, fontFamily: "monospace", fontSize: 9 }}>{e.key}</td>
                  <td style={{ padding: "5px 8px", color: theme.text, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.summary}</td>
                  <td style={{ padding: "5px 8px" }}><StatusBadge status={e.status} /></td>
                  <td style={{ padding: "5px 8px", color: theme.textMuted, fontSize: 9 }}>{e.requestType}</td>
                </tr>
              ))}</tbody>
            </table>
            {planned.length === 0 && <p style={{ color: theme.textDim, textAlign: "center", padding: 12, fontSize: 11 }}>No planned deliverables</p>}
          </div>
        </div>

        {/* Unplanned Deliverables Table */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Unplanned Deliverables <span style={{ color: theme.warning, fontWeight: 700 }}>({unplanned.length})</span>
          </div>
          <div style={{ maxHeight: 180, overflowY: "auto", borderRadius: 8, border: `1px solid ${theme.cardBorder}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
              <thead>
                <tr style={{ background: theme.surface }}>
                  {["Key","Summary","Status","Type"].map(h => (
                    <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: theme.textDim, fontWeight: 600, position: "sticky", top: 0, background: theme.surface }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>{unplanned.map(e => (
                <tr key={e.key} style={{ borderBottom: `1px solid ${theme.cardBorder}22` }}>
                  <td style={{ padding: "5px 8px", color: theme.warning, fontFamily: "monospace", fontSize: 9 }}>{e.key}</td>
                  <td style={{ padding: "5px 8px", color: theme.text, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.summary}</td>
                  <td style={{ padding: "5px 8px" }}><StatusBadge status={e.status} /></td>
                  <td style={{ padding: "5px 8px", color: theme.textMuted, fontSize: 9 }}>{e.requestType}</td>
                </tr>
              ))}</tbody>
            </table>
            {unplanned.length === 0 && <p style={{ color: theme.textDim, textAlign: "center", padding: 12, fontSize: 11 }}>No unplanned deliverables</p>}
          </div>
        </div>

        {/* Bottleneck Bar Chart */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Bottleneck (Avg Hours in Status)</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={bottleneckData} margin={{ top: 5, right: 5, left: -15, bottom: 30 }} barCategoryGap="15%">
              <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
              <XAxis dataKey="status" tick={{ fontSize: 7.5, fill: theme.textDim }} angle={-45} textAnchor="end" interval={0} height={60} />
              <YAxis tick={{ fontSize: 9, fill: theme.textDim }} />
              <Tooltip
                contentStyle={{ background: theme.tooltipBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 8, fontSize: 11, color: theme.text }}
                formatter={(val, name, props) => [`${val}h`, props.payload.fullStatus]}
              />
              <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                {bottleneckData.map((entry, i) => (
                  <Cell key={i} fill={entry.hours > maxBottleneck * 0.7 ? theme.danger : entry.hours > maxBottleneck * 0.4 ? theme.warning : theme.accent} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Delivery Aggregates Table */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>% Delivery Aggregates</div>
          <div style={{ borderRadius: 8, border: `1px solid ${theme.cardBorder}`, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
              <thead>
                <tr style={{ background: theme.surface }}>
                  {["PI","Sprint","Total","Delivered","% Delivery"].map(h => (
                    <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: theme.textDim, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>{deliveryRows.map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${theme.cardBorder}22`, background: r.isOpen ? `${theme.accent}08` : "transparent" }}>
                  <td style={{ padding: "5px 8px", color: theme.text, fontWeight: r.isOpen ? 600 : 400 }}>{r.pi}</td>
                  <td style={{ padding: "5px 8px", color: theme.textMuted }}>{r.sprint}{r.isOpen ? " *" : ""}</td>
                  <td style={{ padding: "5px 8px", color: theme.text }}>{r.total}</td>
                  <td style={{ padding: "5px 8px", color: theme.success }}>{r.delivered}</td>
                  <td style={{ padding: "5px 8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ flex: 1, height: 6, background: theme.surface, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${r.pct}%`, height: "100%", borderRadius: 3, background: r.pct >= 80 ? theme.success : r.pct >= 50 ? theme.warning : theme.danger }} />
                      </div>
                      <span style={{ color: r.pct >= 80 ? theme.success : r.pct >= 50 ? theme.warning : theme.danger, fontWeight: 600, minWidth: 32, textAlign: "right" }}>{r.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}</tbody>
            </table>
            {deliveryRows.length === 0 && <p style={{ color: theme.textDim, textAlign: "center", padding: 12, fontSize: 11 }}>No data</p>}
          </div>
        </div>

        {/* AI Observations & Recommendations */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12 }}>💡</span> Observations & Recommendations
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {generateInsights(art, sprints, trendData, bottleneckData, deliveryRows, m).map((insight, i) => {
              const iconMap = { danger: "🔴", warning: "🟡", success: "🟢", info: "🔵" };
              const borderMap = { danger: theme.danger, warning: theme.warning, success: theme.success, info: theme.accent };
              return (
                <div key={i} style={{
                  padding: "8px 10px", borderRadius: 8, fontSize: 10, lineHeight: 1.5,
                  background: `${borderMap[insight.type]}08`,
                  borderLeft: `3px solid ${borderMap[insight.type]}`,
                  color: theme.text,
                }}>
                  <span style={{ marginRight: 4 }}>{iconMap[insight.type]}</span>
                  {insight.text}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ISSUE SEARCH MODAL ──────────────────────────────────────────────────────
function IssueSearchModal({ config, onClose }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [issue, setIssue] = useState(null);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setIssue(null);
    try {
      const jira = new JiraService(config.domain, config.email, config.token);
      const details = await jira.getIssueDetails(query.trim().toUpperCase());
      setIssue(details);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: theme.card, border: `1px solid ${theme.cardBorder}`, borderRadius: 16, padding: 24, maxWidth: 800, width: "95%", maxHeight: "85vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ color: theme.text, margin: 0, fontSize: 16 }}>Issue Lookup</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer" }}><X size={18} /></button>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && search()} placeholder="Enter issue key (e.g. BOA-4293)" style={{ flex: 1, padding: "10px 14px", background: theme.surface, border: `1px solid ${theme.cardBorder}`, borderRadius: 8, color: theme.text, fontSize: 13, outline: "none" }} autoFocus />
          <button onClick={search} disabled={loading || !query.trim()} style={{ padding: "10px 16px", background: theme.accent, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}>
            {loading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Search size={14} />} Search
          </button>
        </div>
        {error && <div style={{ padding: "8px 12px", background: `${theme.danger}15`, borderRadius: 8, color: theme.danger, fontSize: 11, marginBottom: 12 }}>{error}</div>}
        {issue && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Header */}
            <div style={{ background: theme.surface, borderRadius: 10, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ color: theme.accent, fontFamily: "monospace", fontWeight: 700, fontSize: 14 }}>{issue.key}</span>
                  <div style={{ color: theme.text, fontSize: 14, fontWeight: 600, marginTop: 4 }}>{issue.summary}</div>
                </div>
                <StatusBadge status={issue.status} />
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
                {[
                  { label: "Project", val: issue.project },
                  { label: "Request Type", val: issue.requestType },
                  { label: "Created", val: fmtDate(issue.created) },
                  { label: "Updated", val: fmtDate(issue.updated) },
                ].map(({ label, val }) => (
                  <div key={label}><div style={{ fontSize: 9, color: theme.textDim, textTransform: "uppercase" }}>{label}</div><div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600 }}>{val}</div></div>
                ))}
              </div>
            </div>

            {/* Description */}
            {issue.description && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", marginBottom: 4 }}>Description</div>
                <div style={{ background: theme.surface, borderRadius: 8, padding: 10, fontSize: 12, color: theme.text, lineHeight: 1.5, maxHeight: 120, overflowY: "auto", whiteSpace: "pre-wrap" }}>{issue.description}</div>
              </div>
            )}

            {/* Sprint History */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", marginBottom: 4 }}>Sprint History ({issue.sprintHistory.length})</div>
              <div style={{ borderRadius: 8, border: `1px solid ${theme.cardBorder}`, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                  <thead><tr style={{ background: theme.surface }}>{["Sprint", "State", "Board", "Start", "End", "Completed"].map(h => <th key={h} style={{ padding: "5px 8px", textAlign: "left", color: theme.textDim, fontWeight: 600 }}>{h}</th>)}</tr></thead>
                  <tbody>{issue.sprintHistory.map((s, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${theme.cardBorder}22` }}>
                      <td style={{ padding: "4px 8px", color: theme.text }}>{cleanSprintName(s.name)}</td>
                      <td style={{ padding: "4px 8px" }}><StatusBadge status={s.state} /></td>
                      <td style={{ padding: "4px 8px", color: theme.textMuted }}>{s.boardId}</td>
                      <td style={{ padding: "4px 8px", color: theme.textMuted }}>{fmtDate(s.startDate)}</td>
                      <td style={{ padding: "4px 8px", color: theme.textMuted }}>{fmtDate(s.endDate)}</td>
                      <td style={{ padding: "4px 8px", color: theme.textMuted }}>{fmtDate(s.completeDate)}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>

            {/* Last 5 Activities */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, textTransform: "uppercase", marginBottom: 4 }}>Last 5 Activities</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {issue.recentActivities.map((act, i) => (
                  <div key={i} style={{ background: theme.surface, borderRadius: 8, padding: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: theme.accent, fontWeight: 600 }}>{act.author}</span>
                      <span style={{ fontSize: 9, color: theme.textDim }}>{fmtDate(act.date)}</span>
                    </div>
                    {act.changes.map((c, j) => (
                      <div key={j} style={{ fontSize: 10, color: theme.textMuted, marginTop: 2 }}>
                        <span style={{ color: theme.textDim }}>{c.field}:</span>{" "}
                        <span style={{ textDecoration: "line-through", opacity: 0.5 }}>{c.from}</span>{" → "}
                        <span style={{ color: theme.text }}>{c.to}</span>
                      </div>
                    ))}
                  </div>
                ))}
                {issue.recentActivities.length === 0 && <div style={{ color: theme.textDim, fontSize: 11 }}>No recent activity</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SETTINGS MODAL ──────────────────────────────────────────────────────────
function SettingsModal({ config, onSave, onClose }) {
  const [form, setForm] = useState(config);
  const [showToken, setShowToken] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: theme.card, border: `1px solid ${theme.cardBorder}`, borderRadius: 20, padding: 32, width: 440, maxHeight: "80vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ color: theme.text, margin: 0, fontSize: 18 }}>Jira Configuration</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer" }}><X size={18} /></button>
        </div>
        {[
          { key: "domain", label: "Jira Domain", placeholder: "yourcompany or yourcompany.atlassian.net", help: "Enter just your subdomain (e.g. 'sterling') or the full domain (e.g. 'sterling.atlassian.net')" },
          { key: "email", label: "Email", placeholder: "you@company.com" },
        ].map(({ key, label, placeholder, help }) => (
          <div key={key} style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, color: theme.textMuted, fontWeight: 600, marginBottom: 6 }}>{label}</label>
            <input
              value={form[key] || ""}
              onChange={e => set(key, e.target.value)}
              placeholder={placeholder}
              style={{ width: "100%", padding: "10px 12px", background: theme.surface, border: `1px solid ${theme.cardBorder}`, borderRadius: 8, color: theme.text, fontSize: 13, outline: "none", boxSizing: "border-box" }}
            />
            {help && <div style={{ fontSize: 10, color: theme.textDim, marginTop: 3 }}>{help}</div>}
          </div>
        ))}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, color: theme.textMuted, fontWeight: 600, marginBottom: 6 }}>API Token</label>
          <div style={{ position: "relative" }}>
            <input
              type={showToken ? "text" : "password"}
              value={form.token || ""}
              onChange={e => set("token", e.target.value)}
              placeholder="Your Jira API token"
              style={{ width: "100%", padding: "10px 36px 10px 12px", background: theme.surface, border: `1px solid ${theme.cardBorder}`, borderRadius: 8, color: theme.text, fontSize: 13, outline: "none", boxSizing: "border-box" }}
            />
            <button onClick={() => setShowToken(!showToken)} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: theme.textDim, cursor: "pointer", padding: 2 }}>
              {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
        {testResult && (
          <div style={{ marginBottom: 12, padding: "8px 12px", borderRadius: 8, fontSize: 11, background: testResult.ok ? `${theme.success}15` : `${theme.danger}15`, color: testResult.ok ? theme.success : theme.danger, border: `1px solid ${testResult.ok ? theme.success : theme.danger}33` }}>
            {testResult.ok ? `✓ Connected as ${testResult.name}` : `✗ ${testResult.error}`}
          </div>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={async () => {
            setTestResult(null);
            try {
              const jira = new JiraService(form.domain, form.email, form.token);
              const me = await jira.testConnection();
              setTestResult({ ok: true, name: me.displayName || me.emailAddress });
            } catch (e) {
              setTestResult({ ok: false, error: e.message });
            }
          }} style={{ padding: "10px 16px", background: theme.surface, color: theme.textMuted, border: `1px solid ${theme.cardBorder}`, borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            Test Connection
          </button>
          <button onClick={() => { onSave(form); }} style={{ flex: 1, padding: "10px 16px", background: theme.accent, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
            Save & Connect
          </button>
          <button onClick={onClose} style={{ padding: "10px 16px", background: theme.surface, color: theme.textMuted, border: `1px solid ${theme.cardBorder}`, borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
            Cancel
          </button>
        </div>
        <button onClick={() => { clearCredentials(); set("email", ""); set("token", ""); setTestResult({ ok: false, error: "Credentials cleared from browser storage" }); }} style={{ marginTop: 10, padding: "6px 12px", background: "transparent", color: theme.danger, border: `1px solid ${theme.danger}33`, borderRadius: 6, cursor: "pointer", fontSize: 10, width: "100%" }}>
          Clear saved credentials from browser
        </button>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function ARTHealthBoard() {
  const [config, setConfig] = useState(() => loadCredentials() || { domain: "sterlingbank", email: "", token: "" });
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState("");
  const [useMock, setUseMock] = useState(true);
  const [mockData] = useState(() => generateMockData());
  const [piOptions, setPiOptions] = useState([]);
  const [selectedPi, setSelectedPi] = useState("");
  const [allPiData, setAllPiData] = useState({});
  const [modalIssues, setModalIssues] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [showPiPrompt, setShowPiPrompt] = useState(false);
  const [rawSprints, setRawSprints] = useState({}); // Sprint lists per ART, stored between phases
  const [piLoaded, setPiLoaded] = useState(""); // Which PI's data is currently loaded
  const carouselRef = useRef(null);
  const configRef = useRef(config);
  configRef.current = config;
  const rawSprintsRef = useRef(rawSprints);
  rawSprintsRef.current = rawSprints;

  // Set favicon on mount
  useEffect(() => { setFavicon(STERLING_LOGO); document.title = "ART Health Board — Sterling Financial Holdings"; }, []);

  // Auto-connect on mount if credentials exist
  useEffect(() => {
    const saved = loadCredentials();
    if (saved && saved.domain && saved.email && saved.token) {
      setConfig(saved); configRef.current = saved;
      setTimeout(() => fetchPIs(saved), 500);
    }
  }, []);

  // Initialize with mock data
  useEffect(() => {
    if (useMock) {
      setPiOptions(mockData.pis);
      setSelectedPi(mockData.activePi);
      setAllPiData(mockData.data);
    }
  }, [useMock, mockData]);

  // ─── PHASE 1: Fetch PIs (sprint lists only) ──────────────────────────────
  const fetchPIs = useCallback(async (cfg) => {
    const c = cfg || configRef.current;
    if (!c.domain || !c.email || !c.token) {
      setError("Please configure Jira credentials in Settings (domain, email, and API token are all required).");
      return;
    }
    setLoading(true);
    setError(null);
    setProgress("Connecting to Jira...");
    setUseMock(false);
    setAllPiData({});
    setPiLoaded("");
    setSelectedPi("");
    setShowPiPrompt(false);

    try {
      const jira = new JiraService(c.domain, c.email, c.token);

      setProgress("Testing credentials...");
      const me = await jira.testConnection();
      setProgress(`Authenticated as ${me.displayName || me.emailAddress || "OK"}. Fetching sprints...`);

      const allSprints = {};
      const piSet = new Set();
      let fetchedCount = 0;
      let failedBoards = [];
      const currentYear = new Date().getFullYear().toString();

      for (const art of ALL_ARTS) {
        fetchedCount++;
        const sprintMap = {}; // Deduplicate sprints by ID across all boards
        
        console.group(`🔄 Phase 1: ${art.key} (${art.boards.length} boards)`);
        for (let bi = 0; bi < art.boards.length; bi++) {
          const boardId = art.boards[bi];
          setProgress(`Fetching sprints: ${art.name} board ${bi + 1}/${art.boards.length} (ART ${fetchedCount}/${ALL_ARTS.length})...`);
          try {
            const sprints = await jira.getBoardSprints(boardId);
            const piSprints = sprints.filter(s => parsePIFromSprint(s.name) && parsePIFromSprint(s.name).includes(currentYear));
            const nonPiSprints = sprints.filter(s => !parsePIFromSprint(s.name) || !parsePIFromSprint(s.name).includes(currentYear));
            console.log(`  Board ${boardId}: ${sprints.length} total sprints, ${piSprints.length} match PI ${currentYear}`);
            if (piSprints.length > 0) {
              console.log(`    PI sprints:`, piSprints.map(s => `${s.name} [${s.state}] (ID: ${s.id})`));
            }
            if (nonPiSprints.length > 0) {
              console.log(`    Non-PI sprints (excluded):`, nonPiSprints.map(s => s.name).slice(0, 10), nonPiSprints.length > 10 ? `...+${nonPiSprints.length - 10} more` : "");
            }
            sprints.forEach(s => {
              if (!sprintMap[s.id]) sprintMap[s.id] = s;
            });
          } catch (e) {
            failedBoards.push({ art: art.name, board: boardId, error: e.message });
            console.warn(`  Board ${boardId}: FAILED — ${e.message}`);
          }
        }

        const dedupedSprints = Object.values(sprintMap);
        const dedupedPiSprints = dedupedSprints.filter(s => parsePIFromSprint(s.name) && parsePIFromSprint(s.name).includes(currentYear));
        console.log(`  TOTAL after dedup: ${dedupedSprints.length} sprints, ${dedupedPiSprints.length} match PI ${currentYear}`);
        console.groupEnd();

        allSprints[art.key] = dedupedSprints;
        dedupedSprints.forEach(s => {
          const pi = parsePIFromSprint(s.name);
          if (pi && pi.includes(currentYear)) piSet.add(pi);
        });
      }

      if (Object.values(allSprints).every(arr => arr.length === 0)) {
        const firstErr = failedBoards[0]?.error || "Unknown error";
        if (firstErr.includes("AUTH_FAILED")) {
          throw new Error("Authentication failed for all boards. Double-check your email and API token in Settings.");
        }
        throw new Error(`No sprints found across any boards. First error: ${firstErr}`);
      }

      const piList = Array.from(piSet).sort();
      if (piList.length === 0) {
        throw new Error(
          `Connected successfully but no PIs found for ${currentYear}. Sprints may not match the naming pattern "PI X ${currentYear} - Sprint N". ` +
          `${failedBoards.length > 0 ? `${failedBoards.length} boards also failed to load.` : ""}`
        );
      }

      // Store sprint data for Phase 2
      setRawSprints(allSprints);
      rawSprintsRef.current = allSprints;
      setPiOptions(piList);
      setProgress("");
      setShowPiPrompt(true);
      setConnected(true);
      saveCredentials(c);

      if (failedBoards.length > 0) {
        setError(`Connected but ${failedBoards.length} board(s) failed: ${failedBoards.map(f => f.art).join(", ")}. Check board IDs.`);
      }
    } catch (e) {
      setError(e.message);
      setUseMock(true);
      setProgress("");
    }
    setLoading(false);
  }, []);

  // ─── PHASE 2: Load data for selected PI ───────────────────────────────────
  const loadPIData = useCallback(async (pi) => {
    const c = configRef.current;
    const allSprints = rawSprintsRef.current;
    if (!c.domain || !c.email || !c.token || !pi) return;
    if (!allSprints || Object.keys(allSprints).length === 0) {
      setError("No sprint data available. Click Sync Jira first.");
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(`Loading data for ${pi}...`);
    setShowPiPrompt(false);

    try {
      const jira = new JiraService(c.domain, c.email, c.token);
      const piData = {};
      piData[pi] = {};

      for (const art of ALL_ARTS) {
        const rawPiSprints = (allSprints[art.key] || []).filter(s => parsePIFromSprint(s.name) === pi);

        // Group sprints by cleaned name (e.g., "Sprint 1") across all boards
        const sprintGroups = {};
        for (const sprint of rawPiSprints) {
          const cleanName = cleanSprintName(sprint.name);
          if (!sprintGroups[cleanName]) {
            sprintGroups[cleanName] = {
              ids: [],
              name: sprint.name,
              cleanName,
              // active if ANY board has it active
              state: sprint.state,
            };
          }
          sprintGroups[cleanName].ids.push(sprint.id);
          // Promote state: active > closed > future
          if (sprint.state === "active") sprintGroups[cleanName].state = "active";
          else if (sprint.state === "closed" && sprintGroups[cleanName].state !== "active") sprintGroups[cleanName].state = "closed";
        }

        const groupList = Object.values(sprintGroups).sort((a, b) => parseSprintNumber(a.cleanName) - parseSprintNumber(b.cleanName));
        
        // Diagnostic: log sprint consolidation for this ART
        console.group(`🔍 ${art.key} — Sprint Consolidation`);
        for (const g of groupList) {
          console.log(`${g.cleanName} [${g.state}]: ${g.ids.length} board sprint(s) → IDs: [${g.ids.join(", ")}]`);
        }
        console.groupEnd();

        const consolidatedSprints = [];
        let groupsDone = 0;

        for (const group of groupList) {
          groupsDone++;
          setProgress(`Loading epics: ${art.short} / ${group.cleanName} (${groupsDone}/${groupList.length})...`);

          // Fetch epics from ALL sprint IDs in this group, deduplicate by key
          const epicMap = {};
          for (const sprintId of group.ids) {
            try {
              const issues = await jira.getSprintIssues(sprintId, art.key);
              console.log(`  ${art.key} ${group.cleanName} sprint ID ${sprintId}: ${issues.length} epics returned`);
              for (const iss of issues) {
                if (!epicMap[iss.key]) {
                  const rtField = iss.fields?.[REQUEST_TYPE_FIELD];
                  const rtValue = rtField?.value || rtField?.name || (typeof rtField === "string" ? rtField : null) || "N/A";
                  epicMap[iss.key] = {
                    key: iss.key,
                    summary: iss.fields?.summary || "",
                    status: iss.fields?.status?.name || "Unknown",
                    requestType: rtValue,
                    timeInStatus: {},
                  };
                }
              }
            } catch (e) {
              console.warn(`Failed epics for ${art.key} sprint ${sprintId}:`, e.message);
            }
          }

          const epics = Object.values(epicMap);
          console.log(`  ${art.key} ${group.cleanName} TOTAL after dedup: ${epics.length} epics → ` +
            epics.map(e => `${e.key} [${e.status}] (${e.requestType})`).join(", "));

          // Fetch changelog for bottleneck (only for active sprint to limit API calls)
          if (group.state === "active" && epics.length > 0) {
            setProgress(`Loading bottleneck data: ${art.short} / ${group.cleanName} (${Math.min(epics.length, 20)} epics)...`);
            let changelogSuccessCount = 0;
            let changelogFailCount = 0;
            for (const epic of epics.slice(0, 20)) {
              try {
                const histories = await jira.getIssueChangelog(epic.key);
                // Sort chronologically — Jira returns newest-first
                histories.sort((a, b) => new Date(a.created) - new Date(b.created));
                const statusTimes = {};
                let lastStatusChange = null;
                let statusTransitions = 0;
                for (const h of histories) {
                  for (const item of h.items || []) {
                    if (item.field === "status") {
                      statusTransitions++;
                      if (lastStatusChange && item.fromString) {
                        const from = new Date(lastStatusChange);
                        const to = new Date(h.created);
                        const hours = (to - from) / 3600000;
                        statusTimes[item.fromString.toLowerCase()] = (statusTimes[item.fromString.toLowerCase()] || 0) + hours;
                      }
                      lastStatusChange = h.created;
                    }
                  }
                }
                epic.timeInStatus = statusTimes;
                changelogSuccessCount++;
                if (Object.keys(statusTimes).length > 0) {
                  console.log(`  ⏱ ${epic.key}: ${statusTransitions} transitions, statuses:`, statusTimes);
                } else {
                  console.log(`  ⏱ ${epic.key}: ${histories.length} history entries, ${statusTransitions} status transitions, NO time data`);
                }
              } catch (e) {
                changelogFailCount++;
                console.warn(`  ⏱ ${epic.key}: changelog FAILED — ${e.message}`);
              }
            }
            console.log(`  📊 Bottleneck summary for ${art.key} ${group.cleanName}: ${changelogSuccessCount} success, ${changelogFailCount} failed`);
          }

          consolidatedSprints.push({
            id: group.ids[0], // Use first ID as representative
            name: group.name,
            state: group.state,
            epics,
          });
        }

        piData[pi][art.key] = consolidatedSprints;
      }

      setAllPiData(piData);
      setPiLoaded(pi);
      setProgress("");
    } catch (e) {
      setError(e.message);
      setProgress("");
    }
    setLoading(false);
  }, []);

  // When user selects a PI from dropdown, load its data
  const handlePiSelect = useCallback((pi) => {
    setSelectedPi(pi);
    if (pi && pi !== piLoaded && !useMock) {
      loadPIData(pi);
    }
  }, [piLoaded, useMock, loadPIData]);

  // Save config and auto-trigger PI fetch
  const handleSaveConfig = useCallback((newConfig) => {
    setConfig(newConfig);
    configRef.current = newConfig;
    setShowSettings(false);
    setTimeout(() => fetchPIs(newConfig), 100);
  }, [fetchPIs]);

  // Current PI data
  const currentPiData = useMemo(() => allPiData[selectedPi] || {}, [allPiData, selectedPi]);

  // Summary panel data aggregators
  function getSummaryTrend(bankKey) {
    const arts = ART_CONFIG[bankKey].arts;
    const sprintMap = {};
    const bankLabel = ART_CONFIG[bankKey].label;
    
    for (const art of arts) {
      const sprints = currentPiData[art.key] || [];
      for (const s of sprints) {
        const label = cleanSprintName(s.name);
        if (!sprintMap[label]) sprintMap[label] = { name: label, planned: 0, delivered: 0, unplanned: 0, epics: [] };
        const m = calcMetrics(s.epics);
        sprintMap[label].planned += m.planned;
        sprintMap[label].delivered += m.delivered;
        sprintMap[label].unplanned += m.unplanned;
        sprintMap[label].epics.push(...s.epics);
      }
    }

    // Verification logging
    const result = Object.values(sprintMap).sort(sortBySprint);
    console.group(`📊 ${bankLabel} — Summary Breakdown`);
    for (const sprint of result) {
      const deliveredEpics = sprint.epics.filter(e => (e.status || "").toLowerCase() === "deployed to prod");
      const unplannedEpics = sprint.epics.filter(e => UNPLANNED_TYPES.some(t => t.toLowerCase() === (e.requestType || "").toLowerCase()));
      console.group(`${sprint.name}: Planned=${sprint.planned}, Delivered=${sprint.delivered}, Unplanned=${sprint.unplanned}`);
      console.log("All epics:", sprint.epics.map(e => `${e.key} | Status: "${e.status}" | Type: "${e.requestType}"`));
      console.log("Delivered (status = 'deployed to prod'):", deliveredEpics.map(e => `${e.key} "${e.status}"`));
      console.log("Unplanned (Production Fix / Regulatory / ISG):", unplannedEpics.map(e => `${e.key} "${e.requestType}"`));
      console.groupEnd();
    }
    console.groupEnd();

    return result;
  }

  function getOpenSprintIssues(bankKey) {
    const arts = ART_CONFIG[bankKey].arts;
    const epicMap = {};
    for (const art of arts) {
      const sprints = currentPiData[art.key] || [];
      for (const s of sprints) {
        if (s.state === "active") {
          for (const e of (s.epics || [])) {
            if (!epicMap[e.key]) epicMap[e.key] = e;
          }
        }
      }
    }
    return Object.values(epicMap);
  }

  function getBankBottleneck(bankKey) {
    const allEpics = getOpenSprintIssues(bankKey);
    return calcBottleneck(allEpics);
  }

  // Carousel scroll
  const scrollCarousel = (dir) => {
    if (carouselRef.current) {
      const scrollAmount = 460;
      carouselRef.current.scrollBy({ left: dir * scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text, fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
      {/* ── Header ─────────────────────────────────── */}
      <div style={{
        padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: `1px solid ${theme.cardBorder}`, background: `${theme.card}CC`, backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img src={STERLING_LOGO} alt="Sterling" style={{ width: 36, height: 36, borderRadius: 10 }} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3 }}>Sterling Financial Holdings</div>
            <div style={{ fontSize: 11, color: theme.textDim }}>ART Health Board {connected && <span style={{ color: theme.success }}>● Connected</span>}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {useMock && <div style={{ padding: "4px 10px", background: `${theme.warning}22`, color: theme.warning, borderRadius: 6, fontSize: 10, fontWeight: 600 }}>DEMO MODE</div>}
          {loading && <Loader2 size={16} style={{ color: theme.accent, animation: "spin 1s linear infinite" }} />}
          <button onClick={() => setShowSearch(true)} disabled={!connected}
            style={{ padding: "6px 12px", background: theme.surface, border: `1px solid ${theme.cardBorder}`, borderRadius: 8, color: connected ? theme.text : theme.textDim, cursor: connected ? "pointer" : "not-allowed", fontSize: 11, display: "flex", alignItems: "center", gap: 5 }}>
            <Search size={12} /> Search Issue
          </button>
          <button onClick={() => fetchPIs()} disabled={loading || !config.domain}
            style={{ padding: "6px 12px", background: theme.surface, border: `1px solid ${theme.cardBorder}`, borderRadius: 8, color: theme.textMuted, cursor: config.domain ? "pointer" : "not-allowed", fontSize: 11, display: "flex", alignItems: "center", gap: 5, fontWeight: 600 }}>
            <RefreshCw size={12} /> Refresh
          </button>
          <div style={{ position: "relative" }}>
            <select value={selectedPi} onChange={e => handlePiSelect(e.target.value)} disabled={piOptions.length === 0 || loading}
              style={{ padding: "6px 12px", background: showPiPrompt ? theme.accent : theme.surface, border: `1px solid ${showPiPrompt ? theme.accent : theme.cardBorder}`, borderRadius: 8, color: showPiPrompt ? "#fff" : theme.text, fontSize: 12, fontWeight: 600, cursor: piOptions.length > 0 ? "pointer" : "not-allowed", outline: "none", animation: showPiPrompt ? "pulse 1.5s ease-in-out infinite" : "none" }}>
              {!selectedPi && <option value="">— Select PI —</option>}
              {piOptions.map(pi => <option key={pi} value={pi}>{pi}</option>)}
            </select>
            {showPiPrompt && (
              <div style={{
                position: "absolute", top: "100%", right: 0, marginTop: 8, padding: "10px 14px",
                background: theme.accent, color: "#fff", borderRadius: 10, fontSize: 12, fontWeight: 600,
                whiteSpace: "nowrap", zIndex: 200, boxShadow: "0 4px 20px rgba(14,165,233,0.4)",
              }}>
                <div style={{ position: "absolute", top: -6, right: 16, width: 12, height: 12, background: theme.accent, transform: "rotate(45deg)" }} />
                Select a PI to load the dashboard
              </div>
            )}
          </div>
          <button onClick={() => setShowSettings(true)}
            style={{ width: 34, height: 34, borderRadius: 8, background: theme.surface, border: `1px solid ${theme.cardBorder}`, color: theme.textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {progress && (
        <div style={{ margin: "8px 24px", padding: "10px 16px", background: `${theme.accent}12`, border: `1px solid ${theme.accent}33`, borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
          <Loader2 size={14} style={{ color: theme.accent, animation: "spin 1s linear infinite", flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: theme.accent }}>{progress}</span>
        </div>
      )}

      {error && (
        <div style={{ margin: "8px 24px", padding: "10px 16px", background: `${theme.danger}12`, border: `1px solid ${theme.danger}33`, borderRadius: 10, display: "flex", alignItems: "flex-start", gap: 8 }}>
          <AlertTriangle size={14} color={theme.danger} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 12, color: theme.danger, whiteSpace: "pre-wrap" }}>{error}</span>
        </div>
      )}

      {/* ── Summary Panels ────────────────────────── */}
      <div style={{ padding: "16px 24px" }}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {[
            { bank: "sterling", label: ART_CONFIG.sterling.label, color: ART_CONFIG.sterling.color },
            { bank: "altbank", label: ART_CONFIG.altbank.label, color: ART_CONFIG.altbank.color },
            { bank: "shared", label: ART_CONFIG.shared.label, color: ART_CONFIG.shared.color },
          ].map(({ bank, label, color }) => (
            <BankSummaryColumn
              key={bank}
              bankKey={bank}
              bankLabel={label}
              bankColor={color}
              trendData={getSummaryTrend(bank)}
              bottleneckData={getBankBottleneck(bank)}
              onClickIssues={() => {
                const issues = getOpenSprintIssues(bank);
                setModalIssues(issues);
                setModalTitle(`${label} — Open Sprint Epics`);
              }}
            />
          ))}
        </div>
      </div>

      {/* ── ART Carousel ──────────────────────────── */}
      <div style={{ padding: "0 24px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>ART Detail Columns</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => scrollCarousel(-1)} style={{ width: 32, height: 32, borderRadius: 8, background: theme.surface, border: `1px solid ${theme.cardBorder}`, color: theme.textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scrollCarousel(1)} style={{ width: 32, height: 32, borderRadius: 8, background: theme.surface, border: `1px solid ${theme.cardBorder}`, color: theme.textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div ref={carouselRef} style={{
          display: "flex", gap: 16, overflowX: "auto", paddingBottom: 12,
          scrollSnapType: "x mandatory", scrollbarWidth: "thin",
          scrollbarColor: `${theme.cardBorder} transparent`,
        }}>
          {ALL_ARTS.map(art => (
            <div key={art.key} style={{ scrollSnapAlign: "start" }}>
              <ARTColumn
                art={art}
                sprints={currentPiData[art.key] || []}
                allPiData={allPiData}
                currentPi={selectedPi}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Modals ────────────────────────────────── */}
      {showSettings && <SettingsModal config={config} onSave={handleSaveConfig} onClose={() => setShowSettings(false)} />}
      {showSearch && <IssueSearchModal config={config} onClose={() => setShowSearch(false)} />}
      {modalIssues && <IssueModal issues={modalIssues} title={modalTitle} onClose={() => setModalIssues(null)} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(14,165,233,0.4); } 50% { box-shadow: 0 0 0 8px rgba(14,165,233,0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${theme.cardBorder}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${theme.textDim}; }
        select option { background: ${theme.card}; color: ${theme.text}; }
      `}</style>
    </div>
  );
}

// ─── RENDER ────────────────────────────────────────────────────────────────
createRoot(document.getElementById("root")).render(<ARTHealthBoard />);

