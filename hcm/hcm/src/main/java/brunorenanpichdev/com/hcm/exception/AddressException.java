package brunorenanpichdev.com.hcm.exception;

public class AddressException extends RuntimeException {
	public enum ErrorType {
		INVALID_ADDRESS, ADDRESS_NOT_FOUND
	}

	private final ErrorType errorType;

	public AddressException(ErrorType errorType, String message) {
		super(message);
		this.errorType = errorType;
	}

	public ErrorType getErrorType() {
		return errorType;
	}
}
