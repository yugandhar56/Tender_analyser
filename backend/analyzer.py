import os
import re
import json
from typing import Any
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
DEMO_MODE = os.getenv("DEMO_MODE", "").lower() == "true"

if not DEMO_MODE and (not ANTHROPIC_API_KEY or ANTHROPIC_API_KEY.startswith("your_")):
    print("⚠️  No valid Anthropic API key found. Running in DEMO MODE with mock responses.")
    DEMO_MODE = True

client = None
if not DEMO_MODE:
    client = Anthropic(api_key=ANTHROPIC_API_KEY)

SYSTEM_PROMPT = (
    "You are an expert government tender analyst for India, specializing in Telangana and Andhra Pradesh state tenders. "
    "Your job is to analyze tender documents and extract critical information in simple, clear English that any contractor can understand. "
    "Always structure your response as valid JSON only, no extra text."
)

USER_PROMPT_TEMPLATE = (
    "Analyze this government tender document and extract the following information in JSON format:\n"
    "{\n"
    "  'tender_title': 'Name of the tender/project',\n"
    "  'department': 'Which government department issued it',\n"
    "  'tender_number': 'NIT or tender reference number',\n"
    "  'key_dates': {\n"
    "    'document_sale_start': 'date',\n"
    "    'document_sale_end': 'date',\n"
    "    'submission_deadline': 'date and time',\n"
    "    'bid_opening_date': 'date',\n"
    "    'work_completion_date': 'date or duration'\n"
    "  },\n"
    "  'financial_details': {\n"
    "    'estimated_cost': 'total project value in rupees',\n"
    "    'emd_amount': 'Earnest Money Deposit amount',\n"
    "    'security_deposit': 'percentage or amount',\n"
    "    'performance_guarantee': 'details'\n"
    "  },\n"
    "  'eligibility_criteria': [\n"
    "    'List each eligibility requirement clearly'\n"
    "  ],\n"
    "  'required_documents': [\n"
    "    'List all documents contractor must submit'\n"
    "  ],\n"
    "  'scope_of_work': 'Brief description of what work needs to be done',\n"
    "  'important_conditions': [\n"
    "    'List top 5-7 most important conditions'\n"
    "  ],\n"
    "  'penalty_clauses': [\n"
    "    'Any penalties for delay or non-performance'\n"
    "  ],\n"
    "  'payment_terms': 'How and when contractor will be paid',\n"
    "  'red_flags': [\n"
    "    'Unusual or strict conditions the contractor should be aware of'\n"
    "  ],\n"
    "  'contractor_checklist': [\n"
    "    'Step by step what the contractor needs to do to apply'\n"
    "  ],\n"
    "  'summary_in_simple_words': '3-4 sentences explaining this tender in very simple language for a contractor'\n"
    "}\n\n"
    "Tender Document Text:\n"
)


def _extract_json(content: str) -> Any:
    match = re.search(r"\{[\s\S]*\}", content)
    if not match:
        raise ValueError("Could not parse JSON from model response.")
    json_text = match.group(0)
    return json.loads(json_text)


def _create_completion(prompt: str, max_tokens: int = 2000) -> str:
    if DEMO_MODE:
        # Return mock response for demo mode
        return json.dumps({
            "tender_title": "Reinforcement and resurfacing of SH-16 road stretch",
            "department": "Telangana State Roads & Buildings Department",
            "tender_number": "NIT/TSR&B/2026/078",
            "key_dates": {
                "document_sale_start": "2026-05-05",
                "document_sale_end": "2026-05-20",
                "submission_deadline": "2026-06-10 15:00",
                "bid_opening_date": "2026-06-11",
                "work_completion_date": "12 months from work order"
            },
            "financial_details": {
                "estimated_cost": "₹2.5 crore (₹25,000,000)",
                "emd_amount": "₹2.5 lakh (₹250,000)",
                "security_deposit": "2% of contract value",
                "performance_guarantee": "5% of contract value"
            },
            "eligibility_criteria": [
                "Registered Class 2 or above contractor",
                "Valid GST registration required",
                "Minimum 3 years of road works experience",
                "Turnover of ₹2 crore or more in last 3 years",
                "No blacklisting from government departments"
            ],
            "required_documents": [
                "Duly signed tender form",
                "Contractor registration certificate",
                "GST and PAN documents",
                "Experience certificates with photographs of completed works",
                "EMD payment receipt (DD or bank guarantee)",
                "Power of attorney if applying through authorized representative",
                "Audited financial statements for last 3 years"
            ],
            "scope_of_work": "Reinforcement and resurfacing of 38 km stretch of SH-16 including drainage repairs, pavement restoration, and road markings",
            "important_conditions": [
                "Submit sealed packet before deadline - NO LATE SUBMISSIONS ACCEPTED",
                "Follow all Telangana R&B specifications and standards",
                "Mandatory site visit before bid submission",
                "All rates must be inclusive of taxes and duties",
                "Mobilization period: 15 days from work order",
                "Quality inspection at 50%, 75%, and 100% completion",
                "Contractor responsible for traffic management during work"
            ],
            "penalty_clauses": [
                "Liquidated damages: 0.5% per week for delay",
                "Maximum penalty: 10% of contract value",
                "Deficiency in work: 1-2% recovery depending on severity"
            ],
            "payment_terms": "Monthly progress payments after site engineer certification of completed work. Payment within 30 days of invoice submission.",
            "red_flags": [
                "Very strict 15-day mobilization period - ensure resources are ready",
                "No separate payment for diversion or traffic management costs",
                "Weather delays do not extend timeline",
                "Quality penalties are strictly enforced"
            ],
            "contractor_checklist": [
                "Download tender document from department website",
                "Arrange EMD of ₹2.5 lakh (DD in favor of 'Project Director')",
                "Collect registration and GST documents",
                "Prepare detailed quotes page and methodology",
                "Gather proof of experience (certificates and photographs)",
                "Have authorized signatory sign all forms",
                "Prepare sealed packet with all documents in required format",
                "Submit sealed packet before 2026-06-10 15:00",
                "Keep copy of submission receipt for reference"
            ],
            "summary_in_simple_words": "The Telangana government wants to repair and upgrade 38 km of a major road (SH-16). Any contractor with road-building experience and ₹2.5 lakh deposit can apply. The project is worth ₹2.5 crore and must be completed in 12 months. You'll be paid monthly based on work done, but must start within 15 days of getting the order. Submit your bid by June 10, 2026 at 3 PM."
        })
    
    response = client.completions.create(
        model="claude-sonnet-4-6",
        prompt=f"{SYSTEM_PROMPT}\n\n{prompt}",
        max_tokens_to_sample=max_tokens,
        temperature=0.0,
        stop_sequences=[],
    )
    return response.completion


def _analyze_chunk(text: str) -> dict[str, Any]:
    prompt = USER_PROMPT_TEMPLATE + text
    raw_response = _create_completion(prompt)
    return _extract_json(raw_response)


def _merge_partial_results(partials: list[dict[str, Any]]) -> dict[str, Any]:
    merged = {
        "tender_title": None,
        "department": None,
        "tender_number": None,
        "key_dates": {},
        "financial_details": {},
        "eligibility_criteria": [],
        "required_documents": [],
        "scope_of_work": None,
        "important_conditions": [],
        "penalty_clauses": [],
        "payment_terms": None,
        "red_flags": [],
        "contractor_checklist": [],
        "summary_in_simple_words": None,
    }

    def pick_first(field, value):
        if not merged[field] and value:
            merged[field] = value

    for partial in partials:
        pick_first("tender_title", partial.get("tender_title"))
        pick_first("department", partial.get("department"))
        pick_first("tender_number", partial.get("tender_number"))
        pick_first("scope_of_work", partial.get("scope_of_work"))
        pick_first("payment_terms", partial.get("payment_terms"))
        pick_first("summary_in_simple_words", partial.get("summary_in_simple_words"))

        for key, value in (partial.get("key_dates") or {}).items():
            if value and key not in merged["key_dates"]:
                merged["key_dates"][key] = value

        for key, value in (partial.get("financial_details") or {}).items():
            if value and key not in merged["financial_details"]:
                merged["financial_details"][key] = value

        merged["eligibility_criteria"] += [item for item in (partial.get("eligibility_criteria") or []) if item]
        merged["required_documents"] += [item for item in (partial.get("required_documents") or []) if item]
        merged["important_conditions"] += [item for item in (partial.get("important_conditions") or []) if item]
        merged["penalty_clauses"] += [item for item in (partial.get("penalty_clauses") or []) if item]
        merged["red_flags"] += [item for item in (partial.get("red_flags") or []) if item]
        merged["contractor_checklist"] += [item for item in (partial.get("contractor_checklist") or []) if item]

    for key in [
        "eligibility_criteria",
        "required_documents",
        "important_conditions",
        "penalty_clauses",
        "red_flags",
        "contractor_checklist",
    ]:
        merged[key] = list(dict.fromkeys(merged[key]))

    return merged


def analyze_tender(full_text: str) -> dict[str, Any]:
    chunks = []
    if len(full_text) > 100000:
        chunk_size = 100000
        start = 0
        while start < len(full_text):
            end = min(start + chunk_size, len(full_text))
            chunks.append(full_text[start:end])
            start = end
    else:
        chunks = [full_text]

    partial_results = []
    for chunk in chunks:
        partial_results.append(_analyze_chunk(chunk))

    if len(partial_results) == 1:
        return partial_results[0]

    merged = _merge_partial_results(partial_results)
    consolidation_prompt = (
        "Please merge the following partial JSON analyses into one complete JSON object. "
        "Keep the output valid JSON only, with no extra surrounding text. "
        "Deduplicate list items and preserve the most specific values for dates, amounts, and descriptive text.\n\n"
        "Partial analyses:\n"
    )

    for partial in partial_results:
        consolidation_prompt += json.dumps(partial, ensure_ascii=False) + "\n\n"

    consolidation_prompt += "\nFinal merged JSON:" 
    final_response = _create_completion(consolidation_prompt)
    final_json = _extract_json(final_response)
    return final_json
