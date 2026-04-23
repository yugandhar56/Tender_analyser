import fitz

output_path = 'sample_tender.pdf'
text = '''
TELANGANA STATE ROADS & BUILDINGS DEPARTMENT
TENDER NOTICE: NIT/TSR&B/2026/078

Tender Title: Reinforcement and resurfacing of SH-16 road stretch

Key Dates:
Document Sale Start: 2026-05-05
Document Sale End: 2026-05-20
Submission Deadline: 2026-06-10 15:00
Bid Opening Date: 2026-06-11
Work Completion: 12 months from work order

Financial Details:
Estimated Cost: ₹2.5 crore
EMD Amount: ₹2.5 lakh
Security Deposit: 2% of contract value
Performance Guarantee: 5% of contract value

Eligibility Criteria:
- Registered Class 2 or above contractor
- Valid GST registration
- At least 3 years of road works experience
- Turnover of ₹2 crore or more in last 3 years

Required Documents:
- Signed tender form
- Contractor registration certificate
- GST and PAN documents
- Experience certificates
- EMD payment receipt
- Power of attorney if required

Scope of Work:
Reinforcement and resurfacing of the 38 km stretch of SH-16 including drainage repairs.

Important Conditions:
1. Submit before deadline.
2. Follow Telangana R&B specifications.
3. Mandatory site visit.
4. Rates inclusive of taxes.
5. Quality standards required.

Penalty Clauses:
- 0.5% per week liquidated damages.
- Maximum 10% of contract value.

Payment Terms:
Monthly progress payments after certified work inspection.

Red Flags:
- Strict 15-day mobilization.
- No separate payment for diversion.

Contractor Checklist:
- Download tender document.
- Prepare EMD.
- Gather registration and tax documents.
- Sign bid form.
- Submit sealed packet before deadline.
'''

doc = fitz.open()
page = doc.new_page()
line_height = 14
x = 40
y = 40
for line in text.splitlines():
    page.insert_text((x, y), line, fontsize=11, fontname='Times-Roman')
    y += line_height
    if y > 780:
        page = doc.new_page()
        y = 40

doc.save(output_path)
print(f'Sample PDF created at {output_path}')
