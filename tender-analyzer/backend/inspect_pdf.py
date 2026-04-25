import fitz

doc = fitz.open('sample_tender.pdf')
for i, page in enumerate(doc):
    text = page.get_text()
    print(f'PAGE {i} LEN {len(text)}')
    print(text[:1000])
