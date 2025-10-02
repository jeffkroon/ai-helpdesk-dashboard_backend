from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.models.analytics import ExportRequest
from app.services.voiceflow_client import voiceflow_client
import pandas as pd
import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer

router = APIRouter()

@router.post("/")
async def export_report(request: ExportRequest):
    """Export analytics report in CSV or PDF format"""
    try:
        # Get data from Voiceflow API
        data = await voiceflow_client.get_analytics_overview(
            request.project_id, 
            request.start, 
            request.end
        )
        
        if request.format.lower() == "csv":
            return await export_csv(data)
        elif request.format.lower() == "pdf":
            return await export_pdf(data, request)
        else:
            raise HTTPException(status_code=400, detail="Format must be 'csv' or 'pdf'")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")

async def export_csv(data: dict):
    """Export data as CSV"""
    # Convert data to DataFrame
    metrics_df = pd.DataFrame([data.get("metrics", {})])
    
    # Create CSV in memory
    output = io.StringIO()
    metrics_df.to_csv(output, index=False)
    csv_content = output.getvalue()
    output.close()
    
    # Return as streaming response
    return StreamingResponse(
        io.BytesIO(csv_content.encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=analytics_report.csv"}
    )

async def export_pdf(data: dict, request: ExportRequest):
    """Export data as PDF"""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    title = Paragraph("AI Helpdesk Analytics Report", styles['Title'])
    story.append(title)
    story.append(Spacer(1, 12))
    
    # Date range
    date_range = Paragraph(f"Period: {request.start} to {request.end}", styles['Normal'])
    story.append(date_range)
    story.append(Spacer(1, 12))
    
    # Metrics
    metrics = data.get("metrics", {})
    for key, value in metrics.items():
        metric_text = f"{key.replace('_', ' ').title()}: {value}"
        story.append(Paragraph(metric_text, styles['Normal']))
        story.append(Spacer(1, 6))
    
    # Build PDF
    doc.build(story)
    buffer.seek(0)
    
    # Return as streaming response
    return StreamingResponse(
        io.BytesIO(buffer.read()),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=analytics_report.pdf"}
    )
