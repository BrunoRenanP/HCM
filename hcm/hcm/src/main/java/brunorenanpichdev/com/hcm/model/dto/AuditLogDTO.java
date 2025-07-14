package brunorenanpichdev.com.hcm.model.dto;

import brunorenanpichdev.com.hcm.model.AuditLog;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class AuditLogDTO {

    private UUID id;
    private String action;
    private String details;
    private LocalDateTime timestamp;
    private String requestParams;



    public static AuditLog toModel(AuditLogDTO dto) {
        if (dto == null) return null;

        AuditLog model = new AuditLog();
        model.setId(dto.getId());
        model.setAction(dto.getAction());
        model.setDetails(dto.getDetails());
        model.setTimestamp(dto.getTimestamp());
        model.setRequestParams(dto.getRequestParams());
        return model;
    }
}
