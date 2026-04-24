const express = require('express'), cors = require('cors'), app = express();
app.use(cors()).use(express.json({ limit: '1mb' }));
app.get('/health', (req, res) => res.json({ status: 'healthy' }));
app.post('/bfhl', (req, res) => {
    try {
        if (!req.body?.data || !Array.isArray(req.body.data)) return res.status(400).json({ error: 'Invalid data' });
        if (req.body.data.length > 500) return res.status(413).json({ error: 'Payload too large' });
        let invalid = [], dupes = new Set(), seen = new Set(), p2c = new Map(), c2p = new Map();
        req.body.data.forEach(e => {
            if (typeof e !== 'string' || !/^[A-Z]\s*->\s*[A-Z]$/.test(e.trim())) {
                invalid.push(String(e));
                return;
            }
            let parts = e.trim().split('->').map(s=>s.trim()), [f, t] = parts, key = `${f}->${t}`;
            if (f === t) {
                invalid.push(e);
                return;
            }
            if (seen.has(key)) {
                dupes.add(key);
                return;
            }
            seen.add(key);
            if (!p2c.has(f)) p2c.set(f, new Set());
            p2c.get(f).add(t);
            if (!c2p.has(t)) {
                c2p.set(t, f);
            }
        });
        let adj = new Map(), allNodes = new Set([...p2c.keys(), ...c2p.keys()]);
        for (let n of allNodes) adj.set(n, new Set());
        for (let [p, cs] of p2c.entries()) {
            for (let c of cs) {
                adj.get(p).add(c);
                adj.get(c).add(p);
            }
        }
        let comps = [], visited = new Set();
        for (let n of allNodes) {
            if (!visited.has(n)) {
                let q = [n], comp = new Set();
                visited.add(n);
                while(q.length) {
                    let curr = q.shift();
                    comp.add(curr);
                    for (let nbr of adj.get(curr)) {
                        if (!visited.has(nbr)) {
                            visited.add(nbr);
                            q.push(nbr);
                        }
                    }
                }
                comps.push(comp);
            }
        }
        const buildTree = (root, visitedInTree = new Set()) => {
            if (visitedInTree.has(root)) {
                return { t: {}, d: 0, hasCycle: true };
            }
            visitedInTree.add(root);
            let tree = {}, maxD = 1, hasCycle = false;
            let children = p2c.get(root) || [];
            for (let c of children) {
                let result = buildTree(c, new Set(visitedInTree));
                if (result.hasCycle) {
                    hasCycle = true;
                }
                tree[c] = result.t;
                maxD = Math.max(maxD, 1 + result.d);
            }
            return { t: tree, d: maxD, hasCycle: hasCycle };
        };
        const hasCycle = (comp) => {
            let state = new Map();
            const dfs = (n) => {
                state.set(n, 1);
                for (let c of (p2c.get(n) || [])) {
                    if (!comp.has(c)) continue;
                    if (state.get(c) === 1) return true;
                    if (state.get(c) === 0 && dfs(c)) return true;
                }
                state.set(n, 2);
                return false;
            };
            for (let n of comp) {
                if (!state.has(n)) {
                    state.set(n, 0);
                }
            }
            for (let n of comp) {
                if (state.get(n) === 0 && dfs(n)) return true;
            }
            return false;
        };
        let hierarchies = [], totalTrees = 0, totalCycles = 0, largestTreeRoot = null, maxDepth = -1;
        for (let comp of comps) {
            let roots = [...comp].filter(n => !c2p.has(n)).sort();
            let root = roots.length ? roots[0] : [...comp].sort()[0];
            let hasCycleInComp = hasCycle(comp);
            if (hasCycleInComp) {
                totalCycles++;
                hierarchies.push({ 
                    root, 
                    tree: {}, 
                    has_cycle: true,
                    depth: null
                });
            } else {
                totalTrees++;
                let {t, d} = buildTree(root);
                hierarchies.push({ 
                    root, 
                    tree: t, 
                    depth: d,
                    has_cycle: false 
                });
                if (d > maxDepth || (d === maxDepth && (largestTreeRoot === null || root < largestTreeRoot))) {
                    maxDepth = d;
                    largestTreeRoot = root;
                }
            }
        }
        hierarchies.sort((a,b) => a.root.localeCompare(b.root));
        res.json({
            user_id: "MIKHILSAI",
            email_id: "nmikhilsai@gmail.com",
            college_roll_number: "RA2311003020010",
            hierarchies,
            invalid_entries: invalid,
            duplicate_edges: [...dupes],
            summary: {
                total_trees: totalTrees,
                total_cycles: totalCycles,
                largest_tree_root: largestTreeRoot || null
            }
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({error: "Server error", details: err.message});
    }
});
if (require.main === module) app.listen(process.env.PORT || 3000, () => console.log('Backend running on 3000'));
module.exports = app;