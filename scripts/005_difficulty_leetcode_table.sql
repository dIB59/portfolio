-- Sample Projects
-- Removed explicit string IDs, letting Supabase generate UUIDs automatically
INSERT INTO projects (title, year, month, description, tech_stack, achievements, image, live_url, github_url, created_at)
VALUES
  (
    'E-Commerce Platform',
    2023,
    'March',
    'Built a full-stack e-commerce platform with real-time inventory management, payment processing, and an admin dashboard for order management.',
    ARRAY['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'TailwindCSS', 'Redis'],
    ARRAY['Handled 10k+ daily active users', 'Reduced checkout time by 40%', '99.9% uptime SLA'],
    NULL,
    'https://example-ecommerce.com',
    'https://github.com/example/ecommerce',
    NOW() - INTERVAL '18 months'
  ),
  (
    'AI Code Review Tool',
    2023,
    'August',
    'Developed an AI-powered code review assistant that integrates with GitHub to provide automated suggestions, security vulnerability detection, and code quality metrics.',
    ARRAY['Python', 'FastAPI', 'OpenAI API', 'React', 'Docker', 'AWS Lambda'],
    ARRAY['Processed 50k+ pull requests', 'Reduced review time by 60%', 'Featured on Hacker News'],
    NULL,
    'https://ai-code-review.dev',
    'https://github.com/example/ai-code-review',
    NOW() - INTERVAL '14 months'
  ),
  (
    'Real-Time Collaboration Whiteboard',
    2024,
    'January',
    'Created a multiplayer whiteboard application with real-time synchronization, supporting drawing, sticky notes, and video conferencing integration.',
    ARRAY['Next.js', 'Socket.io', 'Canvas API', 'WebRTC', 'Supabase', 'Framer Motion'],
    ARRAY['Supports 100+ concurrent users', 'Sub-50ms latency sync', 'Used by 20+ design teams'],
    NULL,
    'https://collab-board.io',
    'https://github.com/example/collab-board',
    NOW() - INTERVAL '10 months'
  ),
  (
    'DevOps Dashboard',
    2024,
    'May',
    'Built a comprehensive DevOps monitoring dashboard aggregating metrics from multiple cloud providers, with alerting and incident management features.',
    ARRAY['React', 'Go', 'Grafana', 'Prometheus', 'Kubernetes', 'Terraform'],
    ARRAY['Monitors 500+ services', 'Reduced MTTR by 45%', 'Custom alerting rules engine'],
    NULL,
    NULL,
    'https://github.com/example/devops-dash',
    NOW() - INTERVAL '6 months'
  ),
  (
    'Personal Finance Tracker',
    2024,
    'September',
    'A privacy-focused personal finance application with bank sync, budgeting tools, investment tracking, and AI-powered spending insights.',
    ARRAY['Next.js', 'TypeScript', 'Plaid API', 'Chart.js', 'Supabase', 'OpenAI'],
    ARRAY['Bank-level encryption', 'Syncs with 10k+ institutions', 'Smart categorization'],
    NULL,
    'https://finance-tracker.app',
    'https://github.com/example/finance-tracker',
    NOW() - INTERVAL '2 months'
  );

-- Sample Project Updates
-- Using subqueries to get project UUIDs by title instead of hardcoded string IDs
INSERT INTO project_updates (project_id, description, changes, year, month, created_at)
VALUES
  (
    (SELECT id FROM projects WHERE title = 'E-Commerce Platform' LIMIT 1),
    'Added multi-currency support with real-time exchange rates and automatic conversion at checkout.',
    ARRAY['Support for 50+ currencies', 'Real-time exchange rate API', 'Automatic checkout conversion'],
    2023,
    'July',
    NOW() - INTERVAL '15 months'
  ),
  (
    (SELECT id FROM projects WHERE title = 'E-Commerce Platform' LIMIT 1),
    'Released native iOS and Android apps using React Native with full feature parity.',
    ARRAY['React Native implementation', 'Push notifications', 'Offline cart support'],
    2024,
    'February',
    NOW() - INTERVAL '9 months'
  ),
  (
    (SELECT id FROM projects WHERE title = 'AI Code Review Tool' LIMIT 1),
    'Extended the tool to support GitLab repositories alongside GitHub.',
    ARRAY['GitLab API integration', 'Unified MR/PR review', 'Cross-platform webhooks'],
    2024,
    'March',
    NOW() - INTERVAL '8 months'
  ),
  (
    (SELECT id FROM projects WHERE title = 'Real-Time Collaboration Whiteboard' LIMIT 1),
    'Added AI-powered shape recognition that converts hand-drawn shapes into perfect forms.',
    ARRAY['ML shape detection model', 'Real-time conversion', 'Support for 20+ shapes'],
    2024,
    'June',
    NOW() - INTERVAL '5 months'
  ),
  (
    (SELECT id FROM projects WHERE title = 'DevOps Dashboard' LIMIT 1),
    'Built a Slack bot for real-time incident notifications and alert management.',
    ARRAY['Slack bot integration', 'Interactive alert buttons', 'Thread-based incident tracking'],
    2024,
    'October',
    NOW() - INTERVAL '1 month'
  );

-- Sample LeetCode Problems
-- Removed explicit string IDs, letting Supabase generate UUIDs automatically
INSERT INTO leetcode_problems (name, problem_number, problem_type, stuck_on, confidence, solved_date, notes, image, created_at)
VALUES
  (
    'Two Sum',
    1,
    'Array',
    NULL,
    'green',
    '2024-01-15',
    'Classic hash map solution. O(n) time, O(n) space.',
    NULL,
    NOW() - INTERVAL '11 months'
  ),
  (
    'Longest Substring Without Repeating Characters',
    3,
    'Sliding Window',
    'Initially tried brute force O(n³)',
    'green',
    '2024-01-22',
    'Sliding window with hash set. Key insight: expand right, shrink left when duplicate found.',
    NULL,
    NOW() - INTERVAL '10 months'
  ),
  (
    'Merge Intervals',
    56,
    'Array',
    NULL,
    'green',
    '2024-02-05',
    'Sort by start time, then merge overlapping. Common pattern for interval problems.',
    NULL,
    NOW() - INTERVAL '10 months'
  ),
  (
    'Binary Tree Level Order Traversal',
    102,
    'Tree',
    'Forgot to track level boundaries',
    'green',
    '2024-02-18',
    'BFS with queue. Process level by level using queue size.',
    NULL,
    NOW() - INTERVAL '9 months'
  ),
  (
    'Course Schedule',
    207,
    'Graph',
    'Detecting cycles in directed graph',
    'yellow',
    '2024-03-10',
    'Topological sort using DFS. Track visiting/visited states to detect cycles.',
    NULL,
    NOW() - INTERVAL '8 months'
  ),
  (
    'Coin Change',
    322,
    'Dynamic Programming',
    'Bottom-up vs top-down approach',
    'yellow',
    '2024-03-25',
    'Classic DP. dp[i] = min coins to make amount i. dp[i] = min(dp[i], dp[i-coin] + 1)',
    NULL,
    NOW() - INTERVAL '8 months'
  ),
  (
    'LRU Cache',
    146,
    'Design',
    'Implementing doubly linked list correctly',
    'yellow',
    '2024-04-12',
    'Hash map + doubly linked list. O(1) get and put. Keep most recent at head.',
    NULL,
    NOW() - INTERVAL '7 months'
  ),
  (
    'Word Search II',
    212,
    'Trie',
    'Optimizing with trie pruning',
    'red',
    '2024-05-08',
    'Build trie from words, DFS on board. Remove word from trie after finding to avoid duplicates.',
    NULL,
    NOW() - INTERVAL '6 months'
  ),
  (
    'Median of Two Sorted Arrays',
    4,
    'Binary Search',
    'Finding the correct partition',
    'red',
    '2024-06-15',
    'Binary search on smaller array. Find partition where left elements <= right elements.',
    NULL,
    NOW() - INTERVAL '5 months'
  ),
  (
    'Number of Islands',
    200,
    'Graph',
    NULL,
    'green',
    '2024-07-01',
    'DFS/BFS flood fill. Mark visited cells. Count connected components.',
    NULL,
    NOW() - INTERVAL '4 months'
  ),
  (
    'Maximum Subarray',
    53,
    'Dynamic Programming',
    NULL,
    'green',
    '2024-07-20',
    'Kadane algorithm. Track current max and global max. Reset current if negative.',
    NULL,
    NOW() - INTERVAL '4 months'
  ),
  (
    'Trapping Rain Water',
    42,
    'Two Pointers',
    'Understanding the two pointer approach',
    'yellow',
    '2024-08-05',
    'Two pointers from both ends. Water at each position = min(leftMax, rightMax) - height.',
    NULL,
    NOW() - INTERVAL '3 months'
  ),
  (
    'Serialize and Deserialize Binary Tree',
    297,
    'Tree',
    'Handling null nodes in serialization',
    'yellow',
    '2024-09-12',
    'Preorder traversal with null markers. Use queue for deserialization.',
    NULL,
    NOW() - INTERVAL '2 months'
  ),
  (
    'Alien Dictionary',
    269,
    'Graph',
    'Building the graph from word comparisons',
    'red',
    '2024-10-01',
    'Build directed graph from adjacent word pairs. Topological sort for order.',
    NULL,
    NOW() - INTERVAL '2 months'
  ),
  (
    'Valid Parentheses',
    20,
    'Stack',
    NULL,
    'green',
    '2024-10-20',
    'Stack-based. Push opening brackets, pop and match for closing. Classic pattern.',
    NULL,
    NOW() - INTERVAL '1 month'
  );
