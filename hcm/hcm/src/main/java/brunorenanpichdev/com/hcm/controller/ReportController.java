package brunorenanpichdev.com.hcm.controller;

import brunorenanpichdev.com.hcm.service.AuditLoggerService;
import brunorenanpichdev.com.hcm.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/report")
@RequiredArgsConstructor
@Slf4j
public class ReportController {

    private final ReportService reportService;
    private final AuditLoggerService auditLogger;

    @PostMapping("/user")
    public ResponseEntity<?> generateUserReport() {
        String action = "POST /report/user";
        try {
            auditLogger.logSuccess(action, "Request to generate user report received", null);
            reportService.requestReportGeneration();
            auditLogger.logSuccess(action, "User report generation request accepted", null);
            return ResponseEntity.accepted().build();
        } catch (Exception e) {
            log.error("Error generating user report: {}", e.getMessage(), e);
            auditLogger.logError(action, "Failed to request report generation: " + e.getMessage(), null);
            return ResponseEntity.status(500).body("Erro ao solicitar geração do relatório: " + e.getMessage());
        }
    }
}
