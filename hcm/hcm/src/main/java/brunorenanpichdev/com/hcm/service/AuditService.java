package brunorenanpichdev.com.hcm.service;

import brunorenanpichdev.com.hcm.model.AuditLog;
import brunorenanpichdev.com.hcm.model.dto.AuditLogDTO;
import brunorenanpichdev.com.hcm.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public void logAction(AuditLogDTO auditLogDTO) {
        if (Objects.nonNull(auditLogDTO)) {
            AuditLog log = auditLogDTO.toModel(auditLogDTO);
            auditLogRepository.save(log);
        }
    }
}
