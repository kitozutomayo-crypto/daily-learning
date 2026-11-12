// Daily Learning — original Japanese practice prompts.
// Keep existing IDs stable: daily_sessions stores problem_id values.
// Problems with a source URL are inspired by beginner coding skills; descriptions are rewritten.
export const problems = [
  {
    id: 'p001', title: '2つの整数の和', category: '入出力', level: '入門',
    description: '1行に整数 a と b が空白区切りで与えられます。a + b を出力してください。',
    input: '3 7', output: '10', hint: 'input().split() で分割し、map(int, ...) で整数に変換します。',
    concept: '入力・変数・print', solution: 'a, b = map(int, input().split())\nprint(a + b)'
  },
  {
    id: 'p002', title: '奇数か偶数か', category: '条件分岐', level: '入門',
    description: '整数 n が1つ与えられます。偶数なら Even、奇数なら Odd と出力してください。',
    input: '13', output: 'Odd', hint: '2で割った余りを % 演算子で調べます。',
    concept: 'if・else・剰余', solution: 'n = int(input())\nprint("Even" if n % 2 == 0 else "Odd")'
  },
  {
    id: 'p003', title: '積の偶奇', category: '条件分岐', level: '入門',
    description: '整数 a と b が与えられます。積 a × b が偶数なら Even、奇数なら Odd と出力してください。',
    input: '3 4', output: 'Even', hint: '少なくとも一方が偶数なら、積も偶数です。',
    concept: '条件式・剰余', solution: 'a, b = map(int, input().split())\nprint("Even" if a * b % 2 == 0 else "Odd")',
    source: 'https://atcoder.jp/contests/abs/tasks/abc086_a'
  },
  {
    id: 'p004', title: '1の個数', category: '文字列', level: '入門',
    description: '0と1だけからなる長さ3の文字列 s が与えられます。文字 1 が何個含まれるか出力してください。',
    input: '101', output: '2', hint: '文字列の count() メソッドが使えます。',
    concept: '文字列・count', solution: 's = input()\nprint(s.count("1"))',
    source: 'https://atcoder.jp/contests/abs/tasks/abc081_a'
  },
  {
    id: 'p005', title: '1からNまでの合計', category: '繰り返し', level: '入門',
    description: '正の整数 n が与えられます。1 + 2 + … + n の値を出力してください。',
    input: '5', output: '15', hint: 'for i in range(1, n + 1) で順番に足してみましょう。',
    concept: 'for・range・累積和', solution: 'n = int(input())\ntotal = 0\nfor i in range(1, n + 1):\n    total += i\nprint(total)'
  },
  {
    id: 'p006', title: '最大値を探す', category: 'リスト', level: '入門',
    description: '1行目に正の整数 n、2行目に n 個の整数が与えられます。その最大値を出力してください。',
    input: '4\n2 9 1 5', output: '9', hint: 'リストに変換して max() を使います。',
    concept: 'list・map・max', solution: 'n = int(input())\na = list(map(int, input().split()))\nprint(max(a))'
  },
  {
    id: 'p007', title: '60点以上の人数', category: 'リスト', level: '入門',
    description: '1行目に正の整数 n、2行目に n 人の点数が与えられます。60点以上の人数を出力してください。',
    input: '5\n80 55 60 42 91', output: '3', hint: '各点数について 60 以上かを判定して数えます。',
    concept: 'for・条件分岐・カウント', solution: 'n = int(input())\na = list(map(int, input().split()))\nprint(sum(x >= 60 for x in a))'
  },
  {
    id: 'p008', title: '異なる整数の個数', category: '集合', level: '入門',
    description: '1行目に正の整数 n、2行目に n 個の整数が与えられます。異なる値が何種類あるか出力してください。',
    input: '6\n1 2 2 3 1 4', output: '4', hint: 'set() は重複した値を1つにまとめます。',
    concept: 'set・重複除去', solution: 'n = int(input())\na = list(map(int, input().split()))\nprint(len(set(a)))'
  },
  {
    id: 'p009', title: '文字 a の出現回数', category: '文字列', level: '入門',
    description: '小文字の英字だけからなる文字列 s が与えられます。文字 a の出現回数を出力してください。',
    input: 'banana', output: '3', hint: 'count("a") を使うと簡単です。',
    concept: '文字列・文字の出現回数', solution: 's = input()\nprint(s.count("a"))'
  },
  {
    id: 'p010', title: '昇順に並べ替える', category: 'リスト', level: '入門',
    description: '1行目に正の整数 n、2行目に n 個の整数が与えられます。小さい順に空白区切りで出力してください。',
    input: '5\n9 1 4 2 7', output: '1 2 4 7 9', hint: 'sorted() で並べ替え、print(*a) で空白区切りに表示します。',
    concept: 'sorted・アンパック', solution: 'n = int(input())\na = list(map(int, input().split()))\nprint(*sorted(a))'
  },
  {
    id: 'p011', title: '正・負・ゼロを判定', category: '条件分岐', level: '入門',
    description: '整数 n が与えられます。正なら Positive、負なら Negative、0なら Zero と出力してください。',
    input: '-4', output: 'Negative', hint: 'if・elif・else を使って3つの場合に分けます。',
    concept: 'if・elif・else', solution: 'n = int(input())\nif n > 0:\n    print("Positive")\nelif n < 0:\n    print("Negative")\nelse:\n    print("Zero")'
  },
  {
    id: 'p012', title: '文字列を逆順にする', category: '文字列', level: '入門',
    description: '空白を含まない文字列 s が与えられます。文字の順序を逆にして出力してください。',
    input: 'python', output: 'nohtyp', hint: 'スライス [::-1] を試してみましょう。',
    concept: 'スライス', solution: 's = input()\nprint(s[::-1])'
  },
  {
    id: 'p013', title: '偶数の合計', category: '繰り返し', level: '入門',
    description: '1行目に正の整数 n、2行目に n 個の整数が与えられます。偶数だけを足した合計を出力してください。偶数がなければ0を出力します。',
    input: '5\n3 8 4 7 2', output: '14', hint: 'x % 2 == 0 を満たす値だけ合計します。',
    concept: '繰り返し・条件・sum', solution: 'n = int(input())\na = list(map(int, input().split()))\nprint(sum(x for x in a if x % 2 == 0))'
  },
  {
    id: 'p014', title: '3の倍数はいくつ？', category: '繰り返し', level: '入門',
    description: '正の整数 n が与えられます。1以上 n 以下にある3の倍数の個数を出力してください。',
    input: '10', output: '3', hint: '1から n まで順に調べても解けます。',
    concept: 'range・剰余', solution: 'n = int(input())\ncount = 0\nfor x in range(1, n + 1):\n    if x % 3 == 0:\n        count += 1\nprint(count)'
  },
  {
    id: 'p015', title: '文字列の長さ', category: '文字列', level: '入門',
    description: '空白を含まない文字列 s が与えられます。文字数を出力してください。',
    input: 'learning', output: '8', hint: 'len() を使います。',
    concept: 'len・文字列', solution: 's = input()\nprint(len(s))'
  },
  {
    id: 'p016', title: '平均値（小数第2位まで）', category: 'リスト', level: '基礎',
    description: '1行目に正の整数 n、2行目に n 個の整数が与えられます。算術平均を小数第2位まで出力してください。',
    input: '4\n1 2 3 6', output: '3.00', hint: 'sum(a) / len(a) を計算し、f文字列で桁数を指定します。',
    concept: '平均・f文字列', solution: 'n = int(input())\na = list(map(int, input().split()))\nprint(f"{sum(a) / n:.2f}")'
  },
  {
    id: 'p017', title: '単語の出現回数', category: '辞書', level: '基礎',
    description: '1行目に正の整数 n、2行目に n 個の英単語が空白区切りで与えられます。3行目に指定された単語 q が与えられます。q が何回現れるか出力してください。',
    input: '5\ncat dog cat bird cat\ncat', output: '3', hint: '辞書の get() を使って出現回数を記録できます。',
    concept: 'dict・頻度表', solution: 'n = int(input())\na = input().split()\nq = input()\nfreq = {}\nfor word in a:\n    freq[word] = freq.get(word, 0) + 1\nprint(freq.get(q, 0))'
  },
  {
    id: 'p018', title: '2番目に大きい異なる数', category: '集合', level: '基礎',
    description: '1行目に正の整数 n、2行目に n 個の整数が与えられます。異なる値が2種類以上あると保証されます。2番目に大きい異なる値を出力してください。',
    input: '6\n8 2 8 7 3 7', output: '7', hint: 'set() で重複を消してから降順に並べます。',
    concept: 'set・sorted', solution: 'n = int(input())\na = list(map(int, input().split()))\nb = sorted(set(a), reverse=True)\nprint(b[1])'
  },
  {
    id: 'p019', title: '回文判定', category: '文字列', level: '基礎',
    description: '小文字の英字だけからなる文字列 s が与えられます。前から読んでも後ろから読んでも同じなら Yes、違えば No を出力してください。',
    input: 'level', output: 'Yes', hint: 's と s[::-1] を比較します。',
    concept: '文字列・条件判定', solution: 's = input()\nprint("Yes" if s == s[::-1] else "No")'
  },
  {
    id: 'p020', title: '重複を残さず元の順番で出力', category: 'リスト', level: '基礎',
    description: '1行目に正の整数 n、2行目に n 個の整数が与えられます。各値の最初の出現だけを残し、元の順番で空白区切りに出力してください。',
    input: '7\n4 2 4 3 2 1 3', output: '4 2 3 1', hint: 'すでに見た数を set に記録しながら、新しい数だけリストに入れます。',
    concept: 'set・順序保持', solution: 'n = int(input())\na = list(map(int, input().split()))\nseen = set()\nresult = []\nfor x in a:\n    if x not in seen:\n        seen.add(x)\n        result.append(x)\nprint(*result)'
  },
  {
    id: 'p021', title: '指定した値の位置', category: 'リスト', level: '基礎',
    description: '1行目に正の整数 n、2行目に n 個の整数、3行目に整数 x が与えられます。x が最初に現れる位置を0から数えて出力してください。存在しなければ -1 を出力します。',
    input: '5\n9 4 7 4 1\n4', output: '1', hint: 'enumerate() で位置と値を同時に調べます。',
    concept: 'enumerate・探索', solution: 'n = int(input())\na = list(map(int, input().split()))\nx = int(input())\nanswer = -1\nfor i, value in enumerate(a):\n    if value == x:\n        answer = i\n        break\nprint(answer)'
  },
  {
    id: 'p022', title: '各文字の出現回数', category: '辞書', level: '基礎',
    description: '小文字の英字だけからなる文字列 s が与えられます。登場した文字をアルファベット順に並べ、各行に「文字 回数」の形式で出力してください。',
    input: 'banana', output: 'a 3\nb 1\nn 2', hint: '文字をキーとする辞書を作り、sorted() でキーを並べます。',
    concept: 'dict・sorted', solution: 's = input()\nfreq = {}\nfor c in s:\n    freq[c] = freq.get(c, 0) + 1\nfor c in sorted(freq):\n    print(c, freq[c])'
  },
  {
    id: 'p023', title: '累積和を出力', category: 'リスト', level: '基礎',
    description: '1行目に正の整数 n、2行目に n 個の整数が与えられます。先頭から順に足した累積和を空白区切りで出力してください。',
    input: '5\n2 1 3 4 2', output: '2 3 6 10 12', hint: '合計を1つの変数で持ち、各ステップでリストに追加します。',
    concept: '累積和・append', solution: 'n = int(input())\na = list(map(int, input().split()))\ntotal = 0\nresult = []\nfor x in a:\n    total += x\n    result.append(total)\nprint(*result)'
  },
  {
    id: 'p024', title: '関数で最大公約数', category: '関数', level: '基礎',
    description: '正の整数 a と b が与えられます。2数の最大公約数を出力してください。',
    input: '18 24', output: '6', hint: '余りを使って (a, b) を (b, a % b) に更新すると求められます。',
    concept: '関数・ユークリッドの互除法', solution: 'def gcd(a, b):\n    while b:\n        a, b = b, a % b\n    return a\n\na, b = map(int, input().split())\nprint(gcd(a, b))'
  },
  {
    id: 'p025', title: '隣り合う要素の差', category: 'リスト', level: '基礎',
    description: '1行目に2以上の整数 n、2行目に n 個の整数が与えられます。隣り合う要素について「後ろ − 前」の差を順に空白区切りで出力してください。',
    input: '5\n3 8 6 6 10', output: '5 -2 0 4', hint: '添字 i と i+1 の要素を比較します。',
    concept: '添字・差分', solution: 'n = int(input())\na = list(map(int, input().split()))\nprint(*(a[i + 1] - a[i] for i in range(n - 1)))'
  },
  {
    id: 'p026', title: '2つのリストの共通要素', category: '集合', level: '基礎',
    description: '1行目に正の整数 n と m、2行目に n 個、3行目に m 個の整数が与えられます。両方に含まれる異なる整数を昇順で出力してください。共通要素がなければ空行を出力します。',
    input: '4 5\n1 4 6 8\n4 4 7 8 9', output: '4 8', hint: '2つの set の積集合を使いましょう。',
    concept: 'set・積集合', solution: 'n, m = map(int, input().split())\na = set(map(int, input().split()))\nb = set(map(int, input().split()))\nprint(*sorted(a & b))'
  },
  {
    id: 'p027', title: '単語を長さ順に並べる', category: 'ソート', level: '基礎',
    description: '1行目に正の整数 n、2行目に n 個の小文字の英単語が与えられます。文字数の短い順、同じ長さなら辞書順に、1行1単語で出力してください。',
    input: '4\npear fig apple ant', output: 'ant\nfig\npear\napple', hint: 'sorted() の key に (len(x), x) を渡します。',
    concept: 'ソートキー・タプル', solution: 'n = int(input())\na = input().split()\nfor word in sorted(a, key=lambda x: (len(x), x)):\n    print(word)'
  },
  {
    id: 'p028', title: '母音の数を数える', category: '文字列', level: '基礎',
    description: '小文字の英字だけからなる文字列 s が与えられます。母音 a, e, i, o, u が合計何個あるか出力してください。',
    input: 'education', output: '5', hint: '各文字が "aeiou" に含まれるかを調べます。',
    concept: 'in・文字列走査', solution: 's = input()\nprint(sum(c in "aeiou" for c in s))'
  },
  {
    id: 'p029', title: '各行の合計', category: '二次元配列', level: '基礎',
    description: '1行目に正の整数 h と w が与えられ、続く h 行にはそれぞれ w 個の整数が並びます。各行の合計を1行ずつ出力してください。',
    input: '2 3\n1 2 3\n4 5 6', output: '6\n15', hint: 'h 回だけ input() して、それぞれ sum() を使います。',
    concept: '二重データ・sum', solution: 'h, w = map(int, input().split())\nfor _ in range(h):\n    row = list(map(int, input().split()))\n    print(sum(row))'
  },
  {
    id: 'p030', title: '区間内の数を数える', category: '条件分岐', level: '基礎',
    description: '1行目に正の整数 n と整数 l, r（l ≤ r）、2行目に n 個の整数が与えられます。l 以上 r 以下の整数が何個あるか出力してください。',
    input: '6 3 7\n2 3 7 9 5 1', output: '3', hint: 'l <= x <= r の比較式を使います。',
    concept: '比較演算・カウント', solution: 'n, l, r = map(int, input().split())\na = list(map(int, input().split()))\nprint(sum(l <= x <= r for x in a))'
  },
  {
    id: 'p031', title: '二分探索で存在判定', category: '探索', level: '応用',
    description: '1行目に正の整数 n、2行目に昇順（重複可）の n 個の整数、3行目に整数 x が与えられます。x が含まれれば Yes、なければ No と出力してください。',
    input: '6\n1 2 2 4 7 9\n4', output: 'Yes', hint: '探索範囲の中央の値と x を比較して、範囲を半分に縮めます。',
    concept: '二分探索・O(log n)', solution: 'n = int(input())\na = list(map(int, input().split()))\nx = int(input())\nleft, right = 0, n\nwhile left < right:\n    mid = (left + right) // 2\n    if a[mid] < x:\n        left = mid + 1\n    else:\n        right = mid\nprint("Yes" if left < n and a[left] == x else "No")'
  },
  {
    id: 'p032', title: '最も頻出する整数', category: '辞書', level: '応用',
    description: '1行目に正の整数 n、2行目に n 個の整数が与えられます。最も出現回数の多い整数を出力してください。回数が同じなら小さい整数を選びます。',
    input: '7\n4 2 4 3 2 2 4', output: '2', hint: '辞書で回数を数え、回数の降順・数値の昇順で比較します。',
    concept: '頻度表・複数条件の比較', solution: 'n = int(input())\na = list(map(int, input().split()))\nfreq = {}\nfor x in a:\n    freq[x] = freq.get(x, 0) + 1\nprint(min(freq, key=lambda x: (-freq[x], x)))'
  },
  {
    id: 'p033', title: '素数判定', category: '数学', level: '応用',
    description: '1以上の整数 n が与えられます。n が素数なら Yes、そうでなければ No と出力してください。',
    input: '29', output: 'Yes', hint: '2以上で、√n 以下の整数に割り切れるものがないか確認します。',
    concept: '試し割り・計算量', solution: 'n = int(input())\nif n < 2:\n    print("No")\nelse:\n    prime = True\n    d = 2\n    while d * d <= n:\n        if n % d == 0:\n            prime = False\n            break\n        d += 1\n    print("Yes" if prime else "No")'
  },
  {
    id: 'p034', title: '連続する部分列の最大和', category: 'アルゴリズム', level: '応用',
    description: '1行目に正の整数 n、2行目に n 個の整数が与えられます。空でない連続部分列の和の最大値を出力してください。',
    input: '7\n-2 3 -1 5 -6 2 4', output: '7', hint: '「この位置で終わる最大和」を更新します。',
    concept: '動的計画法・Kadane法', solution: 'n = int(input())\na = list(map(int, input().split()))\nbest = current = a[0]\nfor x in a[1:]:\n    current = max(x, current + x)\n    best = max(best, current)\nprint(best)'
  },
  {
    id: 'p035', title: '括弧列の正しさ', category: 'スタック', level: '応用',
    description: '文字 ( と ) だけからなる文字列 s が与えられます。すべての括弧が正しく対応している場合は Yes、そうでなければ No と出力してください。',
    input: '(()())', output: 'Yes', hint: '左括弧でカウントを増やし、右括弧で減らします。途中で負になると不正です。',
    concept: 'スタックの考え方・カウンタ', solution: 's = input()\nbalance = 0\nvalid = True\nfor c in s:\n    balance += 1 if c == "(" else -1\n    if balance < 0:\n        valid = False\n        break\nprint("Yes" if valid and balance == 0 else "No")'
  },
  {
    id: 'p036', title: '区間和クエリ', category: '累積和', level: '応用',
    description: '1行目に正の整数 n と q、2行目に n 個の整数が与えられます。続く q 行に1始まりの区間 l, r（1 ≤ l ≤ r ≤ n）が与えられるので、各区間の和を1行ずつ出力してください。',
    input: '5 3\n2 4 1 3 6\n1 3\n2 5\n4 4', output: '7\n14\n3', hint: '先頭からの累積和を用意すると、区間和は2つの累積和の差で求められます。',
    concept: '累積和・複数クエリ', solution: 'n, q = map(int, input().split())\na = list(map(int, input().split()))\nprefix = [0]\nfor x in a:\n    prefix.append(prefix[-1] + x)\nfor _ in range(q):\n    l, r = map(int, input().split())\n    print(prefix[r] - prefix[l - 1])'
  },
  {
    id: 'p037', title: '最長の連続同一文字', category: '文字列', level: '応用',
    description: '空でない小文字の英字文字列 s が与えられます。同じ文字が連続する最長の長さを出力してください。',
    input: 'aaabbccccd', output: '4', hint: '直前の文字と同じなら連続数を増やし、違えば1に戻します。',
    concept: 'ランレングス・1回走査', solution: 's = input()\ncurrent = best = 1\nfor i in range(1, len(s)):\n    current = current + 1 if s[i] == s[i - 1] else 1\n    best = max(best, current)\nprint(best)'
  },
  {
    id: 'p038', title: '2数の和が目標になる組', category: '探索', level: '応用',
    description: '1行目に正の整数 n と整数 t、2行目に n 個の整数が与えられます。異なる位置の2要素の和が t になる組が存在すれば Yes、なければ No と出力してください。',
    input: '5 10\n3 8 4 6 1', output: 'Yes', hint: 'これまでに見た値を set に入れ、t - x があるかを確認します。',
    concept: 'ハッシュ集合・2数の和', solution: 'n, t = map(int, input().split())\na = list(map(int, input().split()))\nseen = set()\nfound = False\nfor x in a:\n    if t - x in seen:\n        found = True\n        break\n    seen.add(x)\nprint("Yes" if found else "No")'
  },
  {
    id: 'p039', title: 'フィボナッチ数列', category: '動的計画法', level: '応用',
    description: '0以上の整数 n が与えられます。F(0)=0、F(1)=1、F(n)=F(n-1)+F(n-2) で定義される F(n) を出力してください。',
    input: '8', output: '21', hint: '直前の2項だけを記録して繰り返し更新できます。',
    concept: '反復・メモリ効率', solution: 'n = int(input())\na, b = 0, 1\nfor _ in range(n):\n    a, b = b, a + b\nprint(a)'
  },
  {
    id: 'p040', title: '連続した異なる文字の数', category: '文字列', level: '応用',
    description: '小文字の英字だけからなる文字列 s が与えられます。異なる文字だけで構成される連続部分文字列の最大の長さを出力してください。空文字列は与えられません。',
    input: 'abcaef', output: '5', hint: '各文字が直前に現れた位置を記録し、重複したら左端を動かします。',
    concept: '尺取り法・辞書', solution: 's = input()\nlast = {}\nleft = 0\nbest = 0\nfor right, c in enumerate(s):\n    if c in last and last[c] >= left:\n        left = last[c] + 1\n    last[c] = right\n    best = max(best, right - left + 1)\nprint(best)'
  }
]
