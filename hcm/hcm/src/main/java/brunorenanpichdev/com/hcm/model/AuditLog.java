package brunorenanpichdev.com.hcm.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "TB_AUDIT_LOG")
@Data
public class AuditLog {

    @Id
    @GeneratedValue
    private UUID id;
    @Column(nullable = false, length = 100)
    private String action;
    @Column(columnDefinition = "TEXT", nullable = false)
    private String details;
    @Column(nullable = false)
    private LocalDateTime timestamp;
    @Column(columnDefinition = "TEXT", nullable = false)
    private String requestParams;


    @PrePersist
    protected void onCreate() {
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now();
        }
    }
}
