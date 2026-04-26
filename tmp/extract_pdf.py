import pdfplumber

with pdfplumber.open('/home/project/assets/赞比亚国家医保系统建设方案框架v1.1_20260303_1_.pdf') as pdf:
    text = ''
    for i, page in enumerate(pdf.pages[:15]):
        text += f'=== 第{i+1}页 ===\n'
        text += page.extract_text() or ''
        text += '\n\n'
    print(text[:10000])
