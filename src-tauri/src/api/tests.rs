#[cfg(test)]
mod tests {
    use super::super::types::*;

    #[test]
    fn test_create_secret_request_serialization() {
        let request = CreateSecretRequest {
            secret: "test secret".to_string(),
            passphrase: Some("test passphrase".to_string()),
            ttl: 3600,
            recipient: Some("test@example.com".to_string()),
        };

        let json = serde_json::to_string(&request).unwrap();
        assert!(json.contains("test secret"));
        assert!(json.contains("test passphrase"));
        assert!(json.contains("3600"));
    }

    #[test]
    fn test_create_secret_request_without_optional_fields() {
        let request = CreateSecretRequest {
            secret: "test secret".to_string(),
            passphrase: None,
            ttl: 3600,
            recipient: None,
        };

        let json = serde_json::to_string(&request).unwrap();
        let parsed: serde_json::Value = serde_json::from_str(&json).unwrap();

        assert!(parsed["secret"] == "test secret");
        assert!(parsed["passphrase"].is_null());
    }

    #[test]
    fn test_retrieve_secret_request() {
        let request = RetrieveSecretRequest {
            key: "test-key-12345".to_string(),
            passphrase: Some("passphrase".to_string()),
        };

        assert_eq!(request.key, "test-key-12345");
        assert_eq!(request.passphrase, Some("passphrase".to_string()));
    }
}
