import re
import json
import os

sql_file = 'database/05_enneagram_questions.sql'
ts_file = 'backend/src/constants/questions/enneagram.ts'

with open(sql_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern: (1, question_no, 'content', 'options_json', ...)
pattern = re.compile(r"\(1,\s*(\d+),\s*'(.*?)',\s*'(.*?)',\s*\d+,\s*1\)")

matches = pattern.findall(content)

ts_content = "export interface EnneagramOption {\n  text: string;\n  type: number;\n}\n\n"
ts_content += "export interface EnneagramQuestion {\n  questionId: number;\n  content: string;\n  options: EnneagramOption[];\n}\n\n"
ts_content += "export const ENNEAGRAM_QUESTIONS: EnneagramQuestion[] = [\n"

count = 0
for match in matches:
    q_no = match[0]
    q_content = match[1]
    q_options_json = match[2]
    
    try:
        # Fix SQL escaping: \\" -> \" for JSON parser
        q_options_json = q_options_json.replace('\\\\"', '\\"')
        q_options_json = q_options_json.replace("''", "'")
        
        options = json.loads(q_options_json)
        
        options_ts = "[\n"
        for opt in options:
            text = opt['text'].replace("'", "\\'")
            options_ts += f"      {{ text: '{text}', type: {opt['type']} }},\n"
        options_ts += "    ]"
        
        ts_content += f"  {{\n    questionId: {q_no},\n    content: '{q_content}',\n    options: {options_ts}\n  }},\n"
        count += 1
        
    except Exception as e:
        print(f"Error parsing question {q_no}: {e}")

ts_content += "];\n"

with open(ts_file, 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Successfully generated {ts_file} with {count} questions.")
