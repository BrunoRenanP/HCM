package brunorenanpichdev.com.hcm.util;

import brunorenanpichdev.com.hcm.model.dto.AuditLogDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class AuditLogHelper {

    private final ObjectMapper objectMapper;

    public AuditLogDTO createLog(String path, String description, LocalDateTime timestamp, Object body) {
        String payload = "{}";
        if (body != null) {
            try {
                payload = objectMapper.writeValueAsString(body);
            } catch (JsonProcessingException e) {
                payload = "{\"error\": \"Failed to serialize payload\"}";
            }
        }
        return new AuditLogDTO(null, path, description, timestamp, payload);
    }
}
